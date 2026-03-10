import { motion } from 'framer-motion'

export default function RoleToggle({ role, onChange }) {
  const options = [
    { id: 'owner', label: 'Business Owner' },
    { id: 'ops', label: 'Operations Manager' },
  ]

  return (
    <div className="relative flex rounded-xl border border-cyan-500/30 bg-slate-900/70 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className="relative z-10 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide text-slate-200 transition hover:text-cyan-200"
        >
          {role === option.id && (
            <motion.span
              layoutId="role-pill"
              className="absolute inset-0 -z-10 rounded-lg bg-cyan-500/20"
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            />
          )}
          {option.label}
        </button>
      ))}
    </div>
  )
}
