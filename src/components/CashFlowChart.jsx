import { ResponsiveContainer, LineChart, Line, Tooltip, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts'

export default function CashFlowChart({ data }) {
  const transformed = data.slice(-12).map((point, index) => ({
    slot: index + 1,
    net: point.net,
  }))

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="mb-4 font-display text-sm font-semibold text-slate-100">Cash Flow Net Trend</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={transformed}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
            <XAxis dataKey="slot" stroke="#64748b" tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
            <ReferenceLine y={0} stroke="#ef4444" strokeOpacity={0.4} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(2,6,23,0.9)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: 12,
              }}
            />
            <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2.2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
