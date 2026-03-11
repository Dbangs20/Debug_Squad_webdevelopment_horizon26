import { motion } from 'framer-motion'

const FACTOR_CONFIG = [
  { key: 'inventoryRisk', label: 'Inventory Risk', weight: 0.35, bar: 'bg-cyan-400' },
  { key: 'salesDrop', label: 'Sales Drop', weight: 0.3, bar: 'bg-indigo-400' },
  { key: 'supportLoad', label: 'Support Load', weight: 0.2, bar: 'bg-amber-400' },
  { key: 'cashFlowPressure', label: 'Cash Flow Pressure', weight: 0.15, bar: 'bg-rose-400' },
]

export default function RootCausePanel({ factors, warRoomActive }) {
  const weighted = FACTOR_CONFIG.map((factor) => ({
    ...factor,
    contribution: factor.weight * (factors?.[factor.key] ?? 0),
  }))

  const total = weighted.reduce((sum, factor) => sum + factor.contribution, 0)
  const withPct = weighted.map((factor) => ({
    ...factor,
    percentage: total > 0 ? (factor.contribution / total) * 100 : 0,
  }))

  const primary = [...withPct].sort((a, b) => b.percentage - a.percentage)[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`glass-card rounded-2xl p-5 ${warRoomActive ? 'border-rose-500/45 shadow-[0_0_20px_rgba(239,68,68,0.22)]' : ''}`}
    >
      <h3 className="mb-4 font-display text-sm font-semibold text-slate-100">Business Stress Breakdown</h3>

      <div className="space-y-3">
        {withPct.map((factor) => (
          <div key={factor.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <p className="text-slate-200">{factor.label}</p>
              <p className="text-slate-300">{factor.percentage.toFixed(1)}%</p>
            </div>
            <div className="h-2.5 rounded-full bg-slate-800">
              <div className={`${factor.bar} h-full rounded-full`} style={{ width: `${Math.max(2, factor.percentage)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-4 rounded-xl border p-3 text-sm ${warRoomActive ? 'border-rose-500/45 bg-rose-500/10 text-rose-100' : 'border-slate-700 bg-slate-900/65 text-slate-200'}`}>
        <span className="font-semibold">Primary Cause Detected:</span> {primary?.label ?? 'Not enough signal'}
      </div>
    </motion.div>
  )
}
