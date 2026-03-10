import { motion } from 'framer-motion'

export default function LiveIndicator({ tick, isReplaying }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-emerald-400/25 bg-emerald-500/5 px-4 py-2">
      <motion.span
        key={tick}
        initial={{ opacity: 0.4, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1.15 }}
        transition={{ duration: 0.3 }}
        className={`h-2.5 w-2.5 rounded-full ${isReplaying ? 'bg-amber-400' : 'bg-emerald-400'}`}
      />
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-emerald-300">{isReplaying ? 'REPLAY' : 'LIVE'}</p>
        <p className="text-[11px] text-slate-300">{isReplaying ? 'Replaying last 5 minutes...' : 'Updating metrics...'}</p>
      </div>
    </div>
  )
}
