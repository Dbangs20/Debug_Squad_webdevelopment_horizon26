const factorsMeta = [
  { key: 'inventoryRisk', label: 'Inventory Risk', weight: 0.35, color: 'bg-sky-400' },
  { key: 'salesDrop', label: 'Sales Drop', weight: 0.3, color: 'bg-indigo-400' },
  { key: 'supportLoad', label: 'Support Load', weight: 0.2, color: 'bg-amber-400' },
  { key: 'cashFlowPressure', label: 'Cash Flow Pressure', weight: 0.15, color: 'bg-rose-400' },
]

export default function StressExplainabilityPanel({ factors, score }) {
  const weighted = factorsMeta.map((factor) => ({
    ...factor,
    contribution: factor.weight * (factors?.[factor.key] ?? 0),
  }))

  const total = weighted.reduce((sum, factor) => sum + factor.contribution, 0)

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="mb-4 font-display text-sm font-semibold text-slate-100">Stress Explainability</h3>
      <div className="mb-3 rounded-xl border border-violet-500/25 bg-violet-500/10 p-3 text-xs text-violet-100">
        Current stress signal: <span className="font-semibold">{score.toFixed(1)}</span>
      </div>

      <div className="space-y-3">
        {weighted.map((factor) => {
          const pct = total > 0 ? (factor.contribution / total) * 100 : 0
          return (
            <div key={factor.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <p className="text-slate-200">{factor.label}</p>
                <p className="text-slate-300">{pct.toFixed(1)}%</p>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div className={`h-full rounded-full ${factor.color}`} style={{ width: `${Math.min(100, Math.max(2, pct))}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
