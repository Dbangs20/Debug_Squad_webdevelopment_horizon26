const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export const SCENARIO_PRESETS = [
  {
    id: 'normal',
    label: 'Normal',
    description: 'Balanced operating conditions.',
  },
  {
    id: 'flash_sale',
    label: 'Flash Sale',
    description: 'Demand surge with inventory pressure.',
  },
  {
    id: 'supplier_delay',
    label: 'Supplier Delay',
    description: 'Restock delays increase stockout risk.',
  },
  {
    id: 'payment_failure',
    label: 'Payment Failure',
    description: 'Checkout degradation with refund/support load.',
  },
]

export function applyScenarioPreset(metrics, scenario) {
  if (scenario === 'flash_sale') {
    return {
      ...metrics,
      sales: {
        ...metrics.sales,
        revenueToday: Math.round(metrics.sales.revenueToday * 1.08),
        ordersPerMinute: Number((metrics.sales.ordersPerMinute * 1.16).toFixed(1)),
        salesTrend: Number((metrics.sales.salesTrend + 3.5).toFixed(1)),
      },
      inventory: {
        ...metrics.inventory,
        lowStockItems: Math.round(clamp(metrics.inventory.lowStockItems * 1.12, 0, metrics.inventory.totalItems * 0.45)),
        stockHealth: Number(clamp(metrics.inventory.stockHealth - 4, 5, 99).toFixed(1)),
      },
      support: {
        ...metrics.support,
        openTickets: Math.round(metrics.support.openTickets * 1.06),
      },
    }
  }

  if (scenario === 'supplier_delay') {
    return {
      ...metrics,
      inventory: {
        ...metrics.inventory,
        lowStockItems: Math.round(clamp(metrics.inventory.lowStockItems * 1.22 + 4, 0, metrics.inventory.totalItems * 0.7)),
        stockHealth: Number(clamp(metrics.inventory.stockHealth - 9, 5, 99).toFixed(1)),
      },
      sales: {
        ...metrics.sales,
        salesTrend: Number((metrics.sales.salesTrend - 2.8).toFixed(1)),
      },
      support: {
        ...metrics.support,
        ticketGrowthRate: Number((metrics.support.ticketGrowthRate + 2.4).toFixed(1)),
      },
    }
  }

  if (scenario === 'payment_failure') {
    return {
      ...metrics,
      sales: {
        ...metrics.sales,
        revenueToday: Math.round(metrics.sales.revenueToday * 0.88),
        ordersPerMinute: Number(clamp(metrics.sales.ordersPerMinute * 0.78, 2, 80).toFixed(1)),
        salesTrend: Number((metrics.sales.salesTrend - 6).toFixed(1)),
      },
      support: {
        ...metrics.support,
        openTickets: Math.round(metrics.support.openTickets * 1.18),
        responseTime: Number((metrics.support.responseTime + 2.6).toFixed(1)),
      },
      cashFlow: {
        ...metrics.cashFlow,
        revenue: Math.round(metrics.cashFlow.revenue * 0.9),
        expenses: Math.round(metrics.cashFlow.expenses * 1.08),
        profitTrend: Number((metrics.cashFlow.profitTrend - 5).toFixed(1)),
      },
    }
  }

  return metrics
}
