import { EventEmitter } from 'events'
import { BusinessEvent } from '../models/BusinessEvent.js'
import { calculateStress } from '../lib/stressEngine.js'
import { alertsFromEvent } from '../lib/alertEngine.js'
import { generatePrediction } from '../lib/predictionEngine.js'

const EVENT_TYPES = [
  'OrderPlaced',
  'InventoryLow',
  'TicketCreated',
  'PaymentFailed',
  'ShipmentDelayed',
  'SalesSpike',
  'TicketSpike',
]

const randomChoice = (list) => list[Math.floor(Math.random() * list.length)]
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const createInitialMetrics = () => ({
  sales: {
    revenueToday: 14800,
    ordersPerMinute: 22,
    salesTrend: 4.5,
    series: Array.from({ length: 20 }, (_, i) => ({ t: Date.now() - (20 - i) * 2000, revenue: 980 + randomBetween(0, 260), orders: 16 + randomBetween(0, 10) })),
  },
  inventory: {
    totalItems: 1040,
    lowStockItems: 44,
    stockHealth: 84,
  },
  support: {
    openTickets: 36,
    ticketGrowthRate: 3.8,
    responseTime: 10.5,
    series: Array.from({ length: 20 }, (_, i) => ({ t: Date.now() - (20 - i) * 2000, tickets: 24 + randomBetween(0, 20) })),
  },
  cashFlow: {
    revenue: 19200,
    expenses: 14900,
    profitTrend: 5.2,
    series: Array.from({ length: 20 }, (_, i) => ({ t: Date.now() - (20 - i) * 2000, net: 2500 + randomBetween(-900, 1100) })),
  },
  updatedAt: Date.now(),
})

const createEvent = () => {
  const type = randomChoice(EVENT_TYPES)
  const timestamp = Date.now()

  if (type === 'OrderPlaced') {
    return {
      type,
      timestamp,
      value: randomBetween(35, 280),
      items: randomBetween(1, 4),
      metadata: { channel: randomChoice(['Web', 'App', 'Marketplace']) },
      impactScore: randomBetween(8, 22),
    }
  }

  if (type === 'InventoryLow') {
    return {
      type,
      timestamp,
      metadata: {
        sku: `SKU-${randomBetween(21, 77)}`,
        remaining: randomBetween(3, 16),
      },
      impactScore: randomBetween(65, 90),
    }
  }

  if (type === 'TicketCreated' || type === 'TicketSpike') {
    return {
      type,
      timestamp,
      metadata: {
        category: randomChoice(['Delivery', 'Payment', 'Quality', 'Returns']),
      },
      impactScore: randomBetween(35, 75),
    }
  }

  if (type === 'PaymentFailed') {
    return {
      type,
      timestamp,
      metadata: {
        gateway: randomChoice(['Razorpay', 'Stripe', 'PayPal']),
        failureRate: randomBetween(3, 12),
      },
      impactScore: randomBetween(68, 95),
    }
  }

  if (type === 'ShipmentDelayed') {
    return {
      type,
      timestamp,
      metadata: {
        route: randomChoice(['Mumbai-West', 'Delhi-NCR', 'Bangalore-East']),
        delayHours: randomBetween(4, 28),
      },
      impactScore: randomBetween(40, 78),
    }
  }

  return {
    type,
    timestamp,
    metadata: { velocityJump: randomBetween(12, 44) },
    impactScore: randomBetween(28, 62),
  }
}

function applyEvent(metrics, event) {
  const next = structuredClone(metrics)
  const now = Date.now()

  const push = (list, point, limit = 50) => {
    list.push(point)
    if (list.length > limit) list.splice(0, list.length - limit)
  }

  switch (event.type) {
    case 'OrderPlaced':
      next.sales.revenueToday += event.value
      next.sales.ordersPerMinute = clamp(next.sales.ordersPerMinute + randomBetween(1, 4), 2, 75)
      next.sales.salesTrend = clamp(next.sales.salesTrend + 0.7, -35, 35)
      next.cashFlow.revenue += event.value
      break
    case 'InventoryLow':
      next.inventory.lowStockItems = clamp(next.inventory.lowStockItems + randomBetween(4, 12), 1, next.inventory.totalItems)
      next.inventory.stockHealth = clamp(next.inventory.stockHealth - randomBetween(2, 7), 5, 99)
      break
    case 'TicketCreated':
      next.support.openTickets = clamp(next.support.openTickets + randomBetween(1, 5), 4, 260)
      next.support.ticketGrowthRate = clamp(next.support.ticketGrowthRate + 0.9, -10, 35)
      next.support.responseTime = clamp(next.support.responseTime + 0.7, 3, 55)
      break
    case 'TicketSpike':
      next.support.openTickets = clamp(next.support.openTickets + randomBetween(8, 18), 4, 260)
      next.support.ticketGrowthRate = clamp(next.support.ticketGrowthRate + 2.7, -10, 35)
      next.support.responseTime = clamp(next.support.responseTime + 1.3, 3, 55)
      break
    case 'PaymentFailed':
      next.sales.salesTrend = clamp(next.sales.salesTrend - 3.2, -35, 35)
      next.sales.ordersPerMinute = clamp(next.sales.ordersPerMinute - randomBetween(1, 5), 2, 75)
      next.cashFlow.expenses += randomBetween(120, 720)
      next.cashFlow.profitTrend = clamp(next.cashFlow.profitTrend - 2.4, -30, 30)
      break
    case 'ShipmentDelayed':
      next.support.openTickets = clamp(next.support.openTickets + randomBetween(3, 9), 4, 260)
      next.support.ticketGrowthRate = clamp(next.support.ticketGrowthRate + 1.4, -10, 35)
      next.inventory.stockHealth = clamp(next.inventory.stockHealth - 1.2, 5, 99)
      break
    case 'SalesSpike':
      next.sales.ordersPerMinute = clamp(next.sales.ordersPerMinute + randomBetween(3, 7), 2, 75)
      next.sales.salesTrend = clamp(next.sales.salesTrend + 2.8, -35, 35)
      next.sales.revenueToday += randomBetween(300, 1200)
      next.cashFlow.revenue += randomBetween(280, 1100)
      break
    default:
      break
  }

  // baseline drift
  next.inventory.totalItems = clamp(next.inventory.totalItems + randomBetween(-8, 6), 550, 1800)
  next.cashFlow.expenses = clamp(next.cashFlow.expenses + randomBetween(-220, 460), 7000, 52000)
  next.support.responseTime = clamp(next.support.responseTime + randomBetween(-1, 1) * 0.3, 2, 60)

  const stockRatio = next.inventory.lowStockItems / Math.max(next.inventory.totalItems, 1)
  next.inventory.stockHealth = Number(clamp(100 - stockRatio * 180, 5, 99).toFixed(1))

  push(next.sales.series, { t: now, revenue: Math.round(next.sales.revenueToday / 12), orders: Number(next.sales.ordersPerMinute.toFixed(1)) })
  push(next.support.series, { t: now, tickets: next.support.openTickets })
  push(next.cashFlow.series, { t: now, net: Math.round(next.cashFlow.revenue - next.cashFlow.expenses) })

  next.updatedAt = now
  next.sales.ordersPerMinute = Number(next.sales.ordersPerMinute.toFixed(1))
  next.sales.salesTrend = Number(next.sales.salesTrend.toFixed(1))
  next.support.ticketGrowthRate = Number(next.support.ticketGrowthRate.toFixed(1))
  next.support.responseTime = Number(next.support.responseTime.toFixed(1))
  next.cashFlow.profitTrend = Number(next.cashFlow.profitTrend.toFixed(1))

  return next
}

export class BusinessEventEngine extends EventEmitter {
  constructor() {
    super()
    this.metrics = createInitialMetrics()
    const stress = calculateStress(this.metrics)
    this.stressScore = stress.stressScore
    this.stressFactors = stress.stressFactors
    this.alerts = []
    this.recentEvents = []
    this.prediction = generatePrediction(this.metrics)
    this.timer = null
    this.running = false
  }

  snapshot() {
    return {
      metrics: this.metrics,
      stressScore: this.stressScore,
      stressFactors: this.stressFactors,
      alerts: this.alerts,
      events: this.recentEvents,
      prediction: this.prediction,
    }
  }

  async persistEvent(event) {
    try {
      await BusinessEvent.create({
        type: event.type,
        timestamp: event.timestamp,
        metadata: { ...event.metadata, value: event.value, items: event.items },
        impactScore: event.impactScore,
      })
    } catch {
      // Continue streaming even if DB write fails.
    }
  }

  async tick() {
    const event = createEvent()
    this.metrics = applyEvent(this.metrics, event)

    const stress = calculateStress(this.metrics)
    this.stressScore = stress.stressScore
    this.stressFactors = stress.stressFactors
    this.prediction = generatePrediction(this.metrics)

    const newAlerts = alertsFromEvent(event, this.metrics, this.stressScore)
    this.alerts = [...newAlerts, ...this.alerts].slice(0, 40)
    this.recentEvents = [event, ...this.recentEvents].slice(0, 120)

    await this.persistEvent(event)

    this.emit('event', {
      event,
      metrics: this.metrics,
      stressScore: this.stressScore,
      stressFactors: this.stressFactors,
      alerts: this.alerts,
      prediction: this.prediction,
    })
  }

  scheduleNext() {
    if (!this.running) return
    const delay = randomBetween(1000, 3000)
    this.timer = setTimeout(async () => {
      await this.tick()
      this.scheduleNext()
    }, delay)
  }

  start() {
    if (this.running) return
    this.running = true
    this.scheduleNext()
  }

  stop() {
    this.running = false
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
}
