const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export function generatePrediction(metrics) {
  const demandPerMinute = Math.max(1, metrics.sales.ordersPerMinute * 1.6)
  const inventoryCapacity = Math.max(1, metrics.inventory.totalItems - metrics.inventory.lowStockItems)
  const pressureRatio = demandPerMinute / Math.max(1, inventoryCapacity / 60)

  if (pressureRatio > 1.25) {
    const minutes = Math.round(clamp(inventoryCapacity / demandPerMinute, 8, 320))
    return {
      level: 'high',
      message: `Inventory for fast-moving SKUs may run out in ~${minutes} minutes at current velocity.`,
      etaMinutes: minutes,
    }
  }

  if (metrics.support.ticketGrowthRate > 9 && metrics.support.responseTime > 18) {
    const minutes = Math.round(clamp(180 - metrics.support.ticketGrowthRate * 8, 20, 240))
    return {
      level: 'medium',
      message: `Support SLA breach likely within ~${minutes} minutes unless queue handling improves.`,
      etaMinutes: minutes,
    }
  }

  return {
    level: 'normal',
    message: 'No immediate stockout or SLA breach predicted in current operating window.',
    etaMinutes: null,
  }
}
