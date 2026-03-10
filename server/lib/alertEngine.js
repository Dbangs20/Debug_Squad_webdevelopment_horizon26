const alertId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function alertsFromEvent(event, metrics, stressScore) {
  const alerts = []

  if (event.type === 'InventoryLow') {
    alerts.push({
      id: alertId(),
      type: 'crisis',
      title: 'Inventory critically low',
      detail: `SKU ${event.metadata.sku} nearing stockout (${event.metadata.remaining} left).`,
      timestamp: Date.now(),
    })
  }

  if (event.type === 'TicketSpike' || event.type === 'TicketCreated') {
    alerts.push({
      id: alertId(),
      type: 'anomaly',
      title: 'Support queue rising',
      detail: `Open tickets at ${metrics.support.openTickets} with response ${metrics.support.responseTime.toFixed(1)}m.`,
      timestamp: Date.now(),
    })
  }

  if (event.type === 'SalesSpike') {
    alerts.push({
      id: alertId(),
      type: 'opportunity',
      title: 'Sales spike detected',
      detail: `Orders/min surged to ${metrics.sales.ordersPerMinute}. Capture demand window.`,
      timestamp: Date.now(),
    })
  }

  if (event.type === 'PaymentFailed') {
    alerts.push({
      id: alertId(),
      type: 'crisis',
      title: 'Payment failure impacting conversions',
      detail: 'Checkout reliability dropped. Route to fallback payment gateway.',
      timestamp: Date.now(),
    })
  }

  if (event.type === 'ShipmentDelayed') {
    alerts.push({
      id: alertId(),
      type: 'anomaly',
      title: 'Shipment delay risk',
      detail: `Carrier delay on route ${event.metadata.route}. Customer complaints may rise.`,
      timestamp: Date.now(),
    })
  }

  if (stressScore > 80) {
    alerts.push({
      id: alertId(),
      type: 'crisis',
      title: 'Business stress in crisis zone',
      detail: 'War Room intervention required across inventory, support, and cash flow.',
      timestamp: Date.now(),
    })
  }

  return alerts
}
