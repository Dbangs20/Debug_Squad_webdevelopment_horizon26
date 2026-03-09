const riskColor = (risk) => {
  if (risk >= 75) return 'text-rose-300 border-rose-500/35 bg-rose-500/10'
  if (risk >= 45) return 'text-amber-300 border-amber-500/35 bg-amber-500/10'
  return 'text-emerald-300 border-emerald-500/35 bg-emerald-500/10'
}

export default function SLARiskPanel({ support }) {
  const loadPressure = support.openTickets * 0.45 + support.ticketGrowthRate * 2.5 + support.responseTime * 2.1
  const riskScore = Math.max(0, Math.min(100, loadPressure))
  const remainingMin = Math.max(5, Math.round((100 - riskScore) * 1.7))

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="mb-4 font-display text-sm font-semibold text-slate-100">Support SLA Risk</h3>

      <div className={`rounded-xl border p-4 ${riskColor(riskScore)}`}>
        <p className="text-xs uppercase tracking-[0.16em]">Estimated SLA Breach</p>
        <p className="mt-2 text-3xl font-bold">{remainingMin} min</p>
        <p className="mt-1 text-xs text-slate-300">
          Based on open tickets ({support.openTickets}), growth rate ({support.ticketGrowthRate.toFixed(1)}%), and response
          time ({support.responseTime.toFixed(1)}m).
        </p>
      </div>
    </div>
  )
}
