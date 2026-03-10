import { Siren, AlertTriangle, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WarRoomMode({ alerts, actions, metrics, onExit }) {
  const crisisAlerts = alerts.filter((item) => item.type === 'crisis').slice(0, 5)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl border border-rose-500/40 bg-rose-950/20 p-5 shadow-[0_0_35px_rgba(239,68,68,0.2)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-300">
          <Siren size={18} />
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em]">War Room Mode</h3>
        </div>
        <button onClick={onExit} className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-500/20">
          Exit Focus Mode
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-rose-500/30 bg-slate-950/60 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-200">Critical Alerts</p>
          <div className="space-y-2 text-sm text-slate-200">
            {crisisAlerts.length
              ? crisisAlerts.map((item) => <p key={item.id}>• {item.title}</p>)
              : <p>• No direct crisis alert, monitor trend velocity.</p>}
          </div>
        </div>

        <div className="rounded-xl border border-rose-500/30 bg-slate-950/60 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-200">Operational Hotspots</p>
          <div className="space-y-2 text-sm text-slate-200">
            <p className="flex items-center gap-2"><AlertTriangle size={14} /> Inventory risk: {metrics.inventory.lowStockItems} low stock SKUs</p>
            <p className="flex items-center gap-2"><AlertTriangle size={14} /> Support backlog: {metrics.support.openTickets} tickets</p>
            <p className="flex items-center gap-2"><AlertTriangle size={14} /> Net flow: {metrics.cashFlow.revenue - metrics.cashFlow.expenses}</p>
          </div>
        </div>

        <div className="rounded-xl border border-rose-500/30 bg-slate-950/60 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-200">Suggested Actions</p>
          <div className="space-y-2 text-sm text-slate-200">
            {actions.slice(0, 3).map((action) => (
              <p key={action} className="flex items-start gap-2"><ShieldAlert size={14} className="mt-1" /> {action}</p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
