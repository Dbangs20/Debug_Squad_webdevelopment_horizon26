import { PackageSearch } from 'lucide-react'

export default function InventoryCard({ inventory }) {
  const risk = inventory.lowStockItems / Math.max(inventory.totalItems, 1)

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-100">Inventory Health</h3>
        <PackageSearch size={16} className="text-cyan-300" />
      </div>

      <p className="text-3xl font-bold text-white">{inventory.stockHealth.toFixed(1)}%</p>
      <p className="mt-1 text-xs text-slate-300">Low stock: {inventory.lowStockItems} / {inventory.totalItems} items</p>

      <div className="mt-4 h-2 rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${risk > 0.18 ? 'bg-rose-500' : risk > 0.1 ? 'bg-amber-400' : 'bg-emerald-400'}`}
          style={{ width: `${Math.min(100, risk * 300)}%` }}
        />
      </div>
    </div>
  )
}
