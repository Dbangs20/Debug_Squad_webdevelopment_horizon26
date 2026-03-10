import { motion } from 'framer-motion'
import { AlertTriangle, ShieldCheck, Siren, TriangleAlert } from 'lucide-react'
import { stressBand } from '../utils/stressCalculator'

const colorByBand = {
  Healthy: '#10b981',
  Warning: '#f59e0b',
  'High Stress': '#fb7185',
  Crisis: '#ef4444',
}

const iconByBand = {
  Healthy: ShieldCheck,
  Warning: TriangleAlert,
  'High Stress': AlertTriangle,
  Crisis: Siren,
}

export default function StressScoreGauge({ score, factors }) {
  const band = stressBand(score)
  const stroke = colorByBand[band]
  const Icon = iconByBand[band]
  const radius = 72
  const circumference = 2 * Math.PI * radius
  const dash = circumference - (score / 100) * circumference

  return (
    <div className="glass-card rounded-2xl p-5 shadow-neon">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-200">Business Stress Score</h3>
        <span className="rounded-md bg-slate-950/60 px-2 py-1 text-xs text-slate-300">0-100</span>
      </div>

      <div className="relative mx-auto h-48 w-48">
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
          <circle cx="90" cy="90" r={radius} stroke="rgba(148,163,184,0.2)" strokeWidth="14" fill="none" />
          <motion.circle
            cx="90"
            cy="90"
            r={radius}
            stroke={stroke}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            initial={false}
            animate={{ strokeDashoffset: dash }}
            strokeDasharray={circumference}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <Icon size={18} className="text-slate-300" />
          <motion.p key={score} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-4xl font-bold text-white">
            {Math.round(score)}
          </motion.p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: stroke }}>
            {band}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <p>Inventory Risk: {Math.round(factors.inventoryRisk)}</p>
        <p>Sales Drop: {Math.round(factors.salesDrop)}</p>
        <p>Support Load: {Math.round(factors.supportLoad)}</p>
        <p>Cash Pressure: {Math.round(factors.cashFlowPressure)}</p>
      </div>
    </div>
  )
}
