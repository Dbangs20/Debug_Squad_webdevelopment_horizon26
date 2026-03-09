const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value))

export function calculateStressFactors(metrics) {
  const inventoryRisk = clamp((metrics.inventory.lowStockItems / Math.max(metrics.inventory.totalItems, 1)) * 420)

  const salesDrop = clamp(
    metrics.sales.salesTrend < 0
      ? Math.abs(metrics.sales.salesTrend) * 2 + (metrics.sales.ordersPerMinute < 20 ? 20 : 0)
      : 8,
  )

  const supportLoad = clamp(
    metrics.support.openTickets * 1.3 + metrics.support.ticketGrowthRate * 1.8 + metrics.support.responseTime * 2,
  )

  const net = metrics.cashFlow.revenue - metrics.cashFlow.expenses
  const burnRatio = metrics.cashFlow.expenses / Math.max(metrics.cashFlow.revenue, 1)
  const cashFlowPressure = clamp(net < 0 ? Math.abs(net) / 220 + burnRatio * 30 : burnRatio * 20)

  return {
    inventoryRisk,
    salesDrop,
    supportLoad,
    cashFlowPressure,
  }
}

export function calculateStressScore(metrics) {
  const factors = calculateStressFactors(metrics)

  const score =
    0.35 * factors.inventoryRisk +
    0.3 * factors.salesDrop +
    0.2 * factors.supportLoad +
    0.15 * factors.cashFlowPressure

  return {
    score: clamp(Number(score.toFixed(1))),
    factors,
  }
}

export function stressBand(score) {
  if (score <= 30) return 'Healthy'
  if (score <= 60) return 'Warning'
  if (score <= 80) return 'High Stress'
  return 'Crisis'
}
