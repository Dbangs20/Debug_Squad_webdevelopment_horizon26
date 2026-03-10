import { Radio } from 'lucide-react'

const badgeByType = {
  OrderPlaced: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
  InventoryLow: 'bg-rose-500/15 text-rose-200 border-rose-500/30',
  TicketCreated: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
  PaymentFailed: 'bg-rose-500/15 text-rose-200 border-rose-500/30',
  ShipmentDelayed: 'bg-orange-500/15 text-orange-200 border-orange-500/30',
  SalesSpike: 'bg-cyan-500/15 text-cyan-200 border-cyan-500/30',
  TicketSpike: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
}

const timeLabel = (ts) => new Date(ts).toLocaleTimeString('en-US', { hour12: false })

const eventText = (event) => {
  if (event.type === 'OrderPlaced') return `₹${event.value ?? '-'} • ${event.items ?? 1} items`
  if (event.type === 'InventoryLow') return `${event.metadata?.sku ?? 'SKU'} • ${event.metadata?.remaining ?? '-'} left`
  if (event.type === 'TicketCreated') return event.metadata?.category ?? 'Support issue'
  if (event.type === 'PaymentFailed') return `${event.metadata?.gateway ?? 'Gateway'} • ${event.metadata?.failureRate ?? '-'}%`
  if (event.type === 'ShipmentDelayed') return `${event.metadata?.route ?? 'Route'} • ${event.metadata?.delayHours ?? '-'}h delay`
  if (event.type === 'SalesSpike') return `Velocity +${event.metadata?.velocityJump ?? '-'}%`
  if (event.type === 'TicketSpike') return 'Queue spike detected'
  return 'Operational event'
}

export default function LiveEventStream({ events, connected }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-100">Live Event Stream</h3>
        <div className="inline-flex items-center gap-2 text-xs text-slate-300">
          <Radio size={14} className={connected ? 'text-emerald-300' : 'text-slate-500'} />
          {connected ? 'Streaming' : 'Disconnected'}
        </div>
      </div>

      <div className="scrollbar-thin max-h-[360px] space-y-2 overflow-y-auto pr-1">
        {events.length ? (
          events.slice(0, 20).map((event, index) => (
            <div key={`${event.timestamp}-${event.type}-${index}`} className="rounded-xl border border-slate-700/70 bg-slate-900/65 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400">[{timeLabel(event.timestamp)}]</span>
                <span className={`rounded-md border px-2 py-0.5 text-[11px] ${badgeByType[event.type] ?? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200'}`}>
                  {event.type}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-100">{eventText(event)}</p>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-3 text-sm text-cyan-100">No events received yet. Start backend stream.</p>
        )}
      </div>
    </div>
  )
}
