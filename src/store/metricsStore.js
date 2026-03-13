import { create } from 'zustand'
import { io } from 'socket.io-client'
import { createInitialMetrics } from '../utils/dataSimulator'
import { generateActions, generateInsights } from '../utils/alertEngine'

const BACKEND_BASE =
  import.meta.env.VITE_SOCKET_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:4000`
    : 'http://localhost:4000')

const API_URL = import.meta.env.VITE_API_URL || `${BACKEND_BASE}/api`
const SOCKET_URL = BACKEND_BASE

const REPLAY_POINTS = 150
const DECISION_POINTS = 40

const eventTone = (type) => {
  if (['SalesSpike', 'OrderPlaced'].includes(type)) return 'positive'
  if (['InventoryLow', 'PaymentFailed', 'TicketSpike', 'ShipmentDelayed'].includes(type)) return 'negative'
  return 'neutral'
}

const eventMessage = (event) => {
  if (event.type === 'OrderPlaced') return `OrderPlaced: ${event.items ?? 1} items, value ${event.value ?? '-'} `
  if (event.type === 'InventoryLow') return `InventoryLow: ${event.metadata?.sku ?? 'SKU'} at ${event.metadata?.remaining ?? '-'} units`
  if (event.type === 'TicketCreated') return `TicketCreated: ${event.metadata?.category ?? 'General'} issue logged`
  if (event.type === 'PaymentFailed') return `PaymentFailed: ${event.metadata?.gateway ?? 'Gateway'} failure rate rising`
  if (event.type === 'ShipmentDelayed') return `ShipmentDelayed: ${event.metadata?.route ?? 'Route'} delayed`
  if (event.type === 'SalesSpike') return 'SalesSpike: conversion momentum increased'
  if (event.type === 'TicketSpike') return 'TicketSpike: support queue accelerated'
  return `${event.type} event detected`
}

const toTimelineEntry = (event) => ({
  id: `${event.timestamp}-${event.type}-${Math.random().toString(36).slice(2, 5)}`,
  timestamp: event.timestamp,
  tone: eventTone(event.type),
  message: eventMessage(event),
})

const defaultStressFactors = {
  inventoryRisk: 0,
  salesDrop: 0,
  supportLoad: 0,
  cashFlowPressure: 0,
}

const fetchJson = async (url) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed request: ${url}`)
  return res.json()
}

const bootstrap = () => {
  const metrics = createInitialMetrics()

  return {
    metrics,
    stressScore: 0,
    stressFactors: defaultStressFactors,
    alerts: [],
    insights: ['Waiting for backend stream...'],
    actions: ['Connect backend to activate recommended actions.'],
    prediction: {
      level: 'normal',
      message: 'Prediction engine data will appear once backend starts.',
      etaMinutes: null,
    },
    role: 'owner',
    page: 'dashboard',
    history: [],
    events: [],
    liveEvents: [],
    decisionLog: [],
    tick: Date.now(),
    isReplaying: false,
    warRoomManual: false,
    socket: null,
    connected: false,
    backendOnline: false,
    lastSocketEventAt: 0,
    pollTimer: null,
    replayTimer: null,
    stressNudge: 0,
  }
}

export const useMetricsStore = create((set, get) => ({
  ...bootstrap(),

  setRole: (role) => set({ role }),
  setPage: (page) => set({ page }),
  toggleWarRoom: () => set((state) => ({ warRoomManual: !state.warRoomManual })),
  setStressNudge: (value) => set({ stressNudge: value }),

  acknowledgeAction: (action) =>
    set((state) => ({
      decisionLog: [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: Date.now(),
          action,
          effect: {
            inventoryRisk: /inventory|stock|supplier|restock/i.test(action) ? 4 : 0,
            salesDrop: /sales|funnel|campaign|conversion/i.test(action) ? 4 : 0,
            supportLoad: /support|ticket|sla|complaint|response/i.test(action) ? 4 : 0,
            cashFlowPressure: /cash|expense|margin|burn|revenue/i.test(action) ? 4 : 0,
          },
        },
        ...state.decisionLog,
      ].slice(0, DECISION_POINTS),
    })),

  syncFromApi: async () => {
    const [metricsRes, alertsRes, stressRes, eventsRes] = await Promise.all([
      fetchJson(`${API_URL}/metrics`),
      fetchJson(`${API_URL}/alerts`),
      fetchJson(`${API_URL}/stress-score`),
      fetchJson(`${API_URL}/events?limit=20`),
    ])

    const metrics = metricsRes.metrics
    const stressScore = Math.max(0, Math.min(100, (stressRes.stressScore ?? 0) + get().stressNudge))
    const liveEvents = eventsRes.events ?? []
    const timeline = liveEvents.map(toTimelineEntry)

    set((state) => ({
      backendOnline: true,
      metrics,
      insights: generateInsights(metrics),
      actions: generateActions(metrics),
      prediction: metricsRes.prediction ?? state.prediction,
      alerts: alertsRes.alerts ?? [],
      stressScore,
      stressFactors: stressRes.stressFactors ?? defaultStressFactors,
      liveEvents,
      events: timeline,
      history: [...state.history, { timestamp: Date.now(), metrics, stressScore }].slice(-REPLAY_POINTS),
      tick: Date.now(),
    }))
  },

  initializeFromApi: async () => {
    try {
      await get().syncFromApi()
    } catch {
      set({ connected: false, backendOnline: false })
    }
  },

  startPolling: () => {
    if (get().pollTimer) return

    const timer = setInterval(async () => {
      // Poll only while websocket is not healthy.
      if (get().connected) return
      try {
        await get().syncFromApi()
      } catch {
        set({ backendOnline: false })
      }
    }, 2000)

    set({ pollTimer: timer })
  },

  stopPolling: () => {
    const pollTimer = get().pollTimer
    if (pollTimer) clearInterval(pollTimer)
    set({ pollTimer: null })
  },

  connectRealtime: async () => {
    if (get().socket) return

    await get().initializeFromApi()
    get().startPolling()

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1200,
    })

    socket.on('connect', () => {
      set({ connected: true, socket, lastSocketEventAt: Date.now() })
      get().stopPolling()
    })

    socket.on('disconnect', () => {
      set({ connected: false })
      get().startPolling()
    })

    socket.on('connect_error', () => {
      set({ connected: false })
      get().startPolling()
    })

    socket.on('newEvent', (event) => {
      set((state) => ({
        connected: true,
        backendOnline: true,
        lastSocketEventAt: Date.now(),
        liveEvents: [event, ...state.liveEvents].slice(0, 20),
        events: [toTimelineEntry(event), ...state.events].slice(0, 180),
        tick: Date.now(),
      }))
    })

    socket.on('updatedMetrics', ({ metrics, prediction }) => {
      set((state) => {
        const score = state.stressScore
        return {
          connected: true,
          backendOnline: true,
          lastSocketEventAt: Date.now(),
          metrics,
          insights: generateInsights(metrics),
          actions: generateActions(metrics),
          prediction: prediction ?? state.prediction,
          history: [...state.history, { timestamp: Date.now(), metrics, stressScore: score }].slice(-REPLAY_POINTS),
          tick: Date.now(),
        }
      })
    })

    socket.on('updatedStressScore', ({ stressScore, stressFactors }) => {
      set((state) => ({
        connected: true,
        backendOnline: true,
        lastSocketEventAt: Date.now(),
        stressScore: Math.max(0, Math.min(100, stressScore + state.stressNudge)),
        stressFactors: stressFactors ?? state.stressFactors,
        tick: Date.now(),
      }))
    })

    socket.on('alerts', (alerts) => {
      set({ connected: true, backendOnline: true, lastSocketEventAt: Date.now(), alerts: alerts ?? [] })
    })

    set({ socket })
  },

  startSimulation: () => {
    get().connectRealtime()
  },

  stopSimulation: () => {
    const socket = get().socket
    if (socket) socket.close()
    get().stopPolling()
    set({ socket: null, connected: false, backendOnline: false })
  },

  replayHistory: () => {
    const { history, replayTimer } = get()
    if (replayTimer || history.length < 3) return

    let index = Math.max(0, history.length - 120)

    set({ isReplaying: true })

    const timer = setInterval(() => {
      const point = history[index]
      if (!point) {
        clearInterval(timer)
        set({ replayTimer: null, isReplaying: false })
        return
      }

      set((state) => ({
        metrics: point.metrics,
        stressScore: Math.max(0, Math.min(100, point.stressScore + state.stressNudge)),
        tick: Date.now(),
      }))

      index += 1

      if (index >= history.length) {
        clearInterval(timer)
        set({ replayTimer: null, isReplaying: false })
      }
    }, 220)

    set({ replayTimer: timer })
  },

  resetAll: () => {
    const socket = get().socket
    if (socket) socket.close()
    const pollTimer = get().pollTimer
    if (pollTimer) clearInterval(pollTimer)
    const replayTimer = get().replayTimer
    if (replayTimer) clearInterval(replayTimer)
    set({ ...bootstrap() })
  },
}))
