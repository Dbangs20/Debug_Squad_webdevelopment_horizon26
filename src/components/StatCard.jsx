import { motion } from 'framer-motion'

export default function StatCard({ label, value, tone = 'cyan', stressPulse = false }) {
  const toneMap = {
    cyan: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-100',
    emerald: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-100',
    amber: 'border-amber-500/25 bg-amber-500/10 text-amber-100',
    rose: 'border-rose-500/25 bg-rose-500/10 text-rose-100',
  }

  return (
    <motion.div
      animate={stressPulse ? { scale: [1, 1.01, 1] } : { scale: 1 }}
      transition={{ duration: 1.6, repeat: stressPulse ? Infinity : 0 }}
      className={`glass-card rounded-xl border p-4 ${toneMap[tone]} ${stressPulse ? 'animate-pulseGlow' : ''}`}
    >
      <p className="text-xs uppercase tracking-[0.15em] text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </motion.div>
  )
}
