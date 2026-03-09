const toneClasses = {
  positive: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
  negative: 'border-rose-500/30 bg-rose-500/10 text-rose-100',
  neutral: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-100',
}

const ageLabel = (timestamp) => {
  const sec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000))
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  return `${min}m ago`
}

export default function TimelinePanel({ events }) {
  const recent = events.filter((event) => Date.now() - event.timestamp <= 60000).slice(0, 8)

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-100">What Changed in Last 60s</h3>
        <span className="text-xs text-slate-400">{recent.length} events</span>
      </div>

      <div className="space-y-2">
        {recent.length ? (
          recent.map((event) => (
            <div key={event.id} className={`rounded-xl border p-3 ${toneClasses[event.tone] ?? toneClasses.neutral}`}>
              <p className="text-sm font-medium">{event.message}</p>
              <p className="mt-1 text-[11px] text-slate-300">{ageLabel(event.timestamp)}</p>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">No significant changes in the last minute.</p>
        )}
      </div>
    </div>
  )
}
