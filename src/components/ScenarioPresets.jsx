import { SCENARIO_PRESETS } from '../utils/scenarioEngine'

export default function ScenarioPresets({ scenario, onSelect }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-100">Scenario Presets</h3>
        <span className="text-[11px] text-slate-400">Dynamic simulation mode</span>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {SCENARIO_PRESETS.map((preset) => {
          const active = preset.id === scenario
          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset.id)}
              className={`rounded-xl border px-3 py-2 text-left transition ${
                active
                  ? 'border-indigo-400/45 bg-indigo-500/20 text-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                  : 'border-slate-700/80 bg-slate-900/50 text-slate-200 hover:border-indigo-500/35 hover:bg-slate-800/60'
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em]">{preset.label}</p>
              <p className="mt-1 text-xs text-slate-400">{preset.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
