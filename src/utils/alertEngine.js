const uid = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`

export function generateAlerts(metrics, score) {
  const alerts = []

  if (metrics.inventory.lowStockItems > 90 || metrics.inventory.stockHealth < 40) {
    alerts.push({
      id: uid(),
      type: 'crisis',
      title: 'Inventory critically low',
      detail: `${metrics.inventory.lowStockItems} SKUs require urgent restock.`,
      timestamp: Date.now(),
    })
  }

  if (metrics.cashFlow.revenue - metrics.cashFlow.expenses < 0) {
    alerts.push({
      id: uid(),
      type: 'crisis',
      title: 'Cash flow turned negative',
      detail: 'Expenses have exceeded revenue in the latest cycle.',
      timestamp: Date.now(),
    })
  }

  if (metrics.sales.salesTrend > 12 && metrics.sales.ordersPerMinute > 35) {
    alerts.push({
      id: uid(),
      type: 'opportunity',
      title: 'Sales spike detected',
      detail: 'Campaign momentum is rising; consider boosting ad spend.',
      timestamp: Date.now(),
    })
  }

  if (metrics.support.ticketGrowthRate > 10 || metrics.support.openTickets > 110) {
    alerts.push({
      id: uid(),
      type: 'anomaly',
      title: 'Support load anomaly',
      detail: 'Tickets are climbing faster than normal baseline.',
      timestamp: Date.now(),
    })
  }

  if (score > 82) {
    alerts.push({
      id: uid(),
      type: 'crisis',
      title: 'Business stress at crisis level',
      detail: 'War Room mode recommended for focused intervention.',
      timestamp: Date.now(),
    })
  }

  return alerts
}

export function generateInsights(metrics) {
  const insights = []

  if (metrics.sales.salesTrend < -8 && metrics.support.ticketGrowthRate > 8) {
    insights.push('Sales dropped while support tickets increased; possible product quality issue.')
  }

  if (metrics.cashFlow.revenue < metrics.cashFlow.expenses) {
    insights.push('Current burn exceeds inflow; prioritize margin-positive channels and delay non-essential spend.')
  }

  if (metrics.inventory.lowStockItems > 70 && metrics.sales.ordersPerMinute > 28) {
    insights.push('Demand is active while inventory weakens; stockout risk is likely in fast-moving categories.')
  }

  if (!insights.length) {
    insights.push('Operations are stable. Continue monitoring conversion rate and response SLAs for early signal shifts.')
  }

  return insights
}

export function generateActions(metrics) {
  const actions = []

  if (metrics.inventory.lowStockItems > 55) {
    actions.push('Restock low inventory SKUs and lock supplier ETAs for top-selling products.')
  }

  if (metrics.support.openTickets > 80 || metrics.support.responseTime > 20) {
    actions.push('Reassign support bandwidth and deploy rapid response templates for top complaint categories.')
  }

  if (metrics.sales.salesTrend < -8) {
    actions.push('Audit funnel drop-off points and launch a 24-hour recovery campaign on high-converting channels.')
  }

  if (metrics.cashFlow.revenue - metrics.cashFlow.expenses < 0) {
    actions.push('Freeze discretionary expenses and renegotiate ad bids to restore positive net flow.')
  }

  if (!actions.length) {
    actions.push('No urgent interventions required. Maintain alert monitoring and weekly operational review cadence.')
  }

  return actions.slice(0, 4)
}
