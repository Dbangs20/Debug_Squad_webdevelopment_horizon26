import { create } from 'zustand'
import { createInitialMetrics, simulateNextMetrics } from '../utils/dataSimulator'
import { calculateStressScore } from '../utils/stressCalculator'
import { generateActions, generateAlerts, generateInsights } from '../utils/alertEngine'
import { applyScenarioPreset } from '../utils/scenarioEngine'

const REPLAY_POINTS = 150
const EVENT_POINTS = 180
const DECISION_POINTS = 40

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value))

const weightedScore = (factors) =>
  0.35 * factors.inventoryRisk +
  0.3 * factors.salesDrop +
  0.2 * factors.supportLoad +
  0.15 * factors.cashFlowPressure

const applyMitigation = (factors, mitigation) => ({
  inventoryRisk: clamp(factors.inventoryRisk - mitigation.inventoryRisk),
  salesDrop: clamp(factors.salesDrop - mitigation.salesDrop),
  supportLoad: clamp(factors.supportLoad - mitigation.supportLoad),
  cashFlowPressure: clamp(factors.cashFlowPressure - mitigation.cashFlowPressure),
})

const decayMitigation = (mitigation) => ({
  inventoryRisk: Number((mitigation.inventoryRisk * 0.82).toFixed(2)),
  salesDrop: Number((mitigation.salesDrop * 0.82).toFixed(2)),
  supportLoad: Number((mitigation.supportLoad * 0.82).toFixed(2)),
  cashFlowPressure: Number((mitigation.cashFlowPressure * 0.82).toFixed(2)),
})

const buildChangeEvents = (previous, nextMetrics, alerts) => {
  if (!previous) return []

  const events = []
  const now = Date.now()

  const revenueDelta = nextMetrics.sales.revenueToday - previous.sales.revenueToday
  if (Math.abs(revenueDelta) > 450) {
    events.push({
      id: `${now}-rev-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: now,
      tone: revenueDelta > 0 ? 'positive' : 'negative',
      message: `Revenue ${revenueDelta > 0 ? 'up' : 'down'} ${Math.abs(revenueDelta).toLocaleString()} vs previous cycle`,
    })
  }

  const inventoryDelta = nextMetrics.inventory.lowStockItems - previous.inventory.lowStockItems
  if (Math.abs(inventoryDelta) > 5) {
    events.push({
      id: `${now}-inv-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: now,
      tone: inventoryDelta > 0 ? 'negative' : 'positive',
      message: `Low-stock SKUs ${inventoryDelta > 0 ? 'increased' : 'decreased'} by ${Math.abs(inventoryDelta)}`,
    })
  }

  const supportDelta = nextMetrics.support.openTickets - previous.support.openTickets
  if (Math.abs(supportDelta) > 8) {
    events.push({
      id: `${now}-sup-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: now,
      tone: supportDelta > 0 ? 'negative' : 'positive',
      message: `Support queue ${supportDelta > 0 ? 'expanded' : 'shrunk'} by ${Math.abs(supportDelta)} tickets`,
    })
  }

  const previousNet = previous.cashFlow.revenue - previous.cashFlow.expenses
  const nextNet = nextMetrics.cashFlow.revenue - nextMetrics.cashFlow.expenses
  if ((previousNet >= 0 && nextNet < 0) || (previousNet < 0 && nextNet >= 0)) {
    events.push({
      id: `${now}-net-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: now,
      tone: nextNet >= 0 ? 'positive' : 'negative',
      message: `Net cash flow ${nextNet >= 0 ? 'returned positive' : 'turned negative'}`,
    })
  }

  alerts.slice(0, 2).forEach((alert) => {
    events.push({
      id: `${now}-alert-${alert.id}`,
      timestamp: now,
      tone: alert.type === 'opportunity' ? 'positive' : 'negative',
      message: `${alert.type.toUpperCase()}: ${alert.title}`,
    })
  })

  return events
}

const defaultMitigation = {
  inventoryRisk: 0,
  salesDrop: 0,
  supportLoad: 0,
  cashFlowPressure: 0,
}

const bootstrap = () => {
  const metrics = createInitialMetrics()
  const { score, factors } = calculateStressScore(metrics)

  return {
    metrics,
    stressScore: score,
    stressFactors: factors,
    alerts: [],
    insights: generateInsights(metrics),
    actions: generateActions(metrics),
    role: 'owner',
    page: 'dashboard',
    scenario: 'normal',
    history: [{ timestamp: Date.now(), metrics, stressScore: score }],
    events: [],
    decisionLog: [],
    mitigation: defaultMitigation,
    tick: Date.now(),
    isReplaying: false,
    warRoomManual: false,
    simulationTimer: null,
    replayTimer: null,
    stressNudge: 0,
  }
}

export const useMetricsStore = create((set, get) => ({
  ...bootstrap(),

  setRole: (role) => set({ role }),
  setPage: (page) => set({ page }),
  setScenario: (scenario) => set({ scenario }),
  toggleWarRoom: () => set((state) => ({ warRoomManual: !state.warRoomManual })),

  setStressNudge: (value) =>
    set((state) => {
      const baseScore = weightedScore(state.stressFactors)
      return {
        stressNudge: value,
        stressScore: clamp(baseScore + value),
        tick: Date.now(),
      }
    }),

  acknowledgeAction: (action) =>
    set((state) => {
      const effect = { ...defaultMitigation }

      if (/restock|inventory|stock|supplier/i.test(action)) effect.inventoryRisk += 8
      if (/support|ticket|complaint|response|sla/i.test(action)) effect.supportLoad += 8
      if (/sales|funnel|campaign|conversion|demand/i.test(action)) effect.salesDrop += 6
      if (/cash|flow|expense|burn|margin|revenue/i.test(action)) effect.cashFlowPressure += 7

      if (!Object.values(effect).some((value) => value > 0)) {
        effect.inventoryRisk = 2
        effect.salesDrop = 2
        effect.supportLoad = 2
        effect.cashFlowPressure = 2
      }

      const nextMitigation = {
        inventoryRisk: clamp(state.mitigation.inventoryRisk + effect.inventoryRisk, 0, 30),
        salesDrop: clamp(state.mitigation.salesDrop + effect.salesDrop, 0, 30),
        supportLoad: clamp(state.mitigation.supportLoad + effect.supportLoad, 0, 30),
        cashFlowPressure: clamp(state.mitigation.cashFlowPressure + effect.cashFlowPressure, 0, 30),
      }

      const adjustedFactors = applyMitigation(state.stressFactors, nextMitigation)
      const score = clamp(weightedScore(adjustedFactors) + state.stressNudge)

      return {
        decisionLog: [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            timestamp: Date.now(),
            action,
            effect,
          },
          ...state.decisionLog,
        ].slice(0, DECISION_POINTS),
        mitigation: nextMitigation,
        stressFactors: adjustedFactors,
        stressScore: score,
        tick: Date.now(),
      }
    }),

  updateMetrics: (nextMetrics) => {
    const previous = get().metrics
    const decayedMitigation = decayMitigation(get().mitigation)
    const { factors } = calculateStressScore(nextMetrics)
    const adjustedFactors = applyMitigation(factors, decayedMitigation)
    const score = clamp(weightedScore(adjustedFactors) + get().stressNudge)
    const newAlerts = generateAlerts(nextMetrics, score)
    const changeEvents = buildChangeEvents(previous, nextMetrics, newAlerts)

    set((state) => {
      const nextHistory = [...state.history, { timestamp: Date.now(), metrics: nextMetrics, stressScore: score }]

      return {
        metrics: nextMetrics,
        stressScore: score,
        stressFactors: adjustedFactors,
        mitigation: decayedMitigation,
        alerts: [...newAlerts, ...state.alerts].slice(0, 18),
        insights: generateInsights(nextMetrics),
        actions: generateActions(nextMetrics),
        events: [...changeEvents, ...state.events].slice(0, EVENT_POINTS),
        history:
          nextHistory.length > REPLAY_POINTS ? nextHistory.slice(nextHistory.length - REPLAY_POINTS) : nextHistory,
        tick: Date.now(),
      }
    })
  },

  startSimulation: () => {
    if (get().simulationTimer) return

    const timer = setInterval(() => {
      if (get().isReplaying) return
      const current = get().metrics
      const withDrift = simulateNextMetrics(current)
      const withScenario = applyScenarioPreset(withDrift, get().scenario)
      get().updateMetrics(withScenario)
    }, 2000)

    set({ simulationTimer: timer })
  },

  stopSimulation: () => {
    const timer = get().simulationTimer
    if (timer) clearInterval(timer)
    set({ simulationTimer: null })
  },

  replayHistory: () => {
    const { history, replayTimer } = get()
    if (replayTimer || history.length < 3) return

    let index = Math.max(0, history.length - 150)

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
        stressScore: clamp(point.stressScore + state.stressNudge),
        tick: Date.now(),
      }))

      index += 1

      if (index >= history.length) {
        clearInterval(timer)
        const latest = history[history.length - 1]
        set((state) => ({
          metrics: latest.metrics,
          stressScore: clamp(latest.stressScore + state.stressNudge),
          replayTimer: null,
          isReplaying: false,
        }))
      }
    }, 250)

    set({ replayTimer: timer })
  },

  resetAll: () => {
    const { simulationTimer, replayTimer } = get()
    if (simulationTimer) clearInterval(simulationTimer)
    if (replayTimer) clearInterval(replayTimer)

    set({ ...bootstrap() })
  },
}))
