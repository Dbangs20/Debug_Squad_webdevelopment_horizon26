import { Bell, Siren, TrendingUp, Radar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const typeConfig = {
  crisis: { icon: Siren, color: 'text-rose-300 border-rose-500/30 bg-rose-500/10' },
  opportunity: { icon: TrendingUp, color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' },
  anomaly: { icon: Radar, color: 'text-amber-300 border-amber-500/30 bg-amber-500/10' },
}

export default function AlertsPanel({ alerts }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-100">Live Alerts</h3>
        <Bell size={16} className="text-slate-300" />
      </div>

      <div className="scrollbar-thin max-h-[280px] space-y-3 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {alerts.length ? (
            alerts.map((alert) => {
              const config = typeConfig[alert.type]
              const Icon = config.icon
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className={`rounded-xl border p-3 ${config.color}`}
                >
                  <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                    <Icon size={14} /> {alert.type}
                  </div>
                  <p className="text-sm font-semibold text-slate-100">{alert.title}</p>
                  <p className="mt-1 text-xs text-slate-300">{alert.detail}</p>
                </motion.div>
              )
            })
          ) : (
            <p className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-sm text-cyan-100">No active alerts. Systems are steady.</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
