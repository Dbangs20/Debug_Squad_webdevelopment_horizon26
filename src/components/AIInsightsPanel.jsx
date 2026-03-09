import { Sparkles } from 'lucide-react'

export default function AIInsightsPanel({ insights, actions, onActionClick, isReplaying }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-100">AI Insights</h3>
        <Sparkles size={16} className="text-fuchsia-300" />
      </div>

      <div className="space-y-2">
        {insights.map((insight) => (
          <p key={insight} className="rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/10 p-3 text-sm text-slate-100">
            {insight}
          </p>
        ))}
      </div>

      <h4 className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Recommended Actions</h4>
      <div className="mt-2 space-y-2">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => onActionClick?.(action)}
            disabled={isReplaying}
            className="w-full rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-left text-sm text-slate-100 transition hover:border-cyan-400/35 hover:bg-cyan-500/15 disabled:opacity-60"
          >
            <span className="mr-2 text-cyan-300">+</span>
            {action}
          </button>
        ))}
      </div>
    </div>
  )
}
