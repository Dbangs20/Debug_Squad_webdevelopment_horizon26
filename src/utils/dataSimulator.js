const bounded = (value, min, max) => Math.max(min, Math.min(max, value))

const drift = (value, step, min, max) => bounded(value + (Math.random() * 2 - 1) * step, min, max)

export function createInitialMetrics() {
  return {
    sales: {
      revenueToday: 12400,
      ordersPerMinute: 24,
      salesTrend: 6,
      series: Array.from({ length: 12 }, (_, i) => ({
        t: i,
        revenue: 900 + Math.round(Math.random() * 300),
        orders: 16 + Math.round(Math.random() * 12),
      })),
    },
    inventory: {
      totalItems: 920,
      lowStockItems: 38,
      stockHealth: 86,
    },
    support: {
      openTickets: 34,
      ticketGrowthRate: 4,
      responseTime: 11,
      series: Array.from({ length: 12 }, (_, i) => ({
        t: i,
        tickets: 24 + Math.round(Math.random() * 18),
      })),
    },
    cashFlow: {
      revenue: 18000,
      expenses: 14100,
      profitTrend: 5,
      series: Array.from({ length: 12 }, (_, i) => ({
        t: i,
        net: 2600 + Math.round((Math.random() * 2 - 1) * 1000),
      })),
    },
    updatedAt: Date.now(),
  }
}

function pushPoint(series, point) {
  const next = [...series, point]
  return next.length > 40 ? next.slice(next.length - 40) : next
}

export function simulateNextMetrics(current) {
  const now = Date.now()

  const revenueToday = drift(current.sales.revenueToday, 560, 5000, 35000)
  const ordersPerMinute = drift(current.sales.ordersPerMinute, 5, 4, 64)
  const salesTrend = drift(current.sales.salesTrend, 4, -28, 30)

  const lowStockItems = Math.round(drift(current.inventory.lowStockItems, 7, 4, 250))
  const totalItems = Math.round(drift(current.inventory.totalItems, 32, 600, 1600))
  const stockHealth = bounded(100 - (lowStockItems / Math.max(totalItems, 1)) * 180, 10, 98)

  const openTickets = Math.round(drift(current.support.openTickets, 9, 6, 220))
  const ticketGrowthRate = drift(current.support.ticketGrowthRate, 3, -8, 26)
  const responseTime = drift(current.support.responseTime, 2, 3, 45)

  const revenue = drift(current.cashFlow.revenue, 720, 9000, 42000)
  const expenses = drift(current.cashFlow.expenses, 760, 8000, 44000)
  const profitTrend = drift(current.cashFlow.profitTrend, 4, -25, 28)

  return {
    sales: {
      revenueToday: Math.round(revenueToday),
      ordersPerMinute: Number(ordersPerMinute.toFixed(1)),
      salesTrend: Number(salesTrend.toFixed(1)),
      series: pushPoint(current.sales.series, {
        t: now,
        revenue: Math.round(revenueToday / 12),
        orders: Number(ordersPerMinute.toFixed(1)),
      }),
    },
    inventory: {
      totalItems,
      lowStockItems,
      stockHealth: Number(stockHealth.toFixed(1)),
    },
    support: {
      openTickets,
      ticketGrowthRate: Number(ticketGrowthRate.toFixed(1)),
      responseTime: Number(responseTime.toFixed(1)),
      series: pushPoint(current.support.series, {
        t: now,
        tickets: openTickets,
      }),
    },
    cashFlow: {
      revenue: Math.round(revenue),
      expenses: Math.round(expenses),
      profitTrend: Number(profitTrend.toFixed(1)),
      series: pushPoint(current.cashFlow.series, {
        t: now,
        net: Math.round(revenue - expenses),
      }),
    },
    updatedAt: now,
  }
}
