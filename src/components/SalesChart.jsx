import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

export default function SalesChart({ data }) {
  const transformed = data.slice(-12).map((point, index) => ({
    slot: index + 1,
    revenue: point.revenue,
    orders: point.orders,
  }))

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="mb-4 font-display text-sm font-semibold text-slate-100">Sales Pulse</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={transformed}>
            <defs>
              <linearGradient id="salesGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
            <XAxis dataKey="slot" stroke="#64748b" tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(2,6,23,0.9)',
                border: '1px solid rgba(6,182,212,0.3)',
                borderRadius: 12,
              }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2.2} fillOpacity={1} fill="url(#salesGlow)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
