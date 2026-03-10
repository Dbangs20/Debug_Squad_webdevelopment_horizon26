import { BrainCircuit } from 'lucide-react'

const palette = {
  high: 'border-rose-500/35 bg-rose-500/10 text-rose-100',
  medium: 'border-amber-500/35 bg-amber-500/10 text-amber-100',
  normal: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-100',
}

export default function PredictiveRiskPanel({ prediction }) {
  const tone = palette[prediction?.level] ?? palette.normal

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-100">Predictive Risk Engine</h3>
        <BrainCircuit size={16} className="text-fuchsia-300" />
      </div>

      <div className={`rounded-xl border p-4 ${tone}`}>
        <p className="text-xs uppercase tracking-[0.16em]">Forecast</p>
        <p className="mt-2 text-sm leading-relaxed">{prediction?.message ?? 'Prediction stream not available yet.'}</p>
        {prediction?.etaMinutes ? (
          <p className="mt-2 text-xs text-slate-200">Estimated time window: {prediction.etaMinutes} minutes</p>
        ) : null}
      </div>
    </div>
  )
}
