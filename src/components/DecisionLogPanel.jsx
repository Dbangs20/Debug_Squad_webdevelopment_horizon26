const formatTime = (timestamp) =>
  new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(timestamp)

const effectText = (effect) => {
  const chunks = []
  if (effect.inventoryRisk) chunks.push(`Inventory -${effect.inventoryRisk}`)
  if (effect.salesDrop) chunks.push(`Sales -${effect.salesDrop}`)
  if (effect.supportLoad) chunks.push(`Support -${effect.supportLoad}`)
  if (effect.cashFlowPressure) chunks.push(`Cash -${effect.cashFlowPressure}`)
  return chunks.join(' | ')
}

export default function DecisionLogPanel({ logs }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-100">Decision Log</h3>
        <span className="text-xs text-slate-400">{logs.length} entries</span>
      </div>

      <div className="space-y-2">
        {logs.length ? (
          logs.slice(0, 6).map((log) => (
            <div key={log.id} className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
              <p className="text-sm text-slate-100">{log.action}</p>
              <p className="mt-1 text-[11px] text-slate-300">{formatTime(log.timestamp)} • {effectText(log.effect)}</p>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-300">
            No actions acknowledged yet. Click a recommended action to record operational response.
          </p>
        )}
      </div>
    </div>
  )
}
