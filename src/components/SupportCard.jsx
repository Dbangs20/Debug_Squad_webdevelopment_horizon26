import { Headset } from 'lucide-react'

export default function SupportCard({ support }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-100">Support Load</h3>
        <Headset size={16} className="text-violet-300" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-xl font-bold text-white">{support.openTickets}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Open</p>
        </div>
        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-xl font-bold text-white">{support.ticketGrowthRate.toFixed(1)}%</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Growth</p>
        </div>
        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-xl font-bold text-white">{support.responseTime.toFixed(1)}m</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Response</p>
        </div>
      </div>
    </div>
  )
}
