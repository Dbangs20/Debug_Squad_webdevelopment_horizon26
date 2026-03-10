import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  ChartColumnBig,
  Boxes,
  HandHelping,
  Wallet,
  BellRing,
  RotateCw,
  Siren,
} from 'lucide-react'
import StressScoreGauge from '../components/StressScoreGauge'
import SalesChart from '../components/SalesChart'
import InventoryCard from '../components/InventoryCard'
import SupportCard from '../components/SupportCard'
import CashFlowChart from '../components/CashFlowChart'
import AlertsPanel from '../components/AlertsPanel'
import AIInsightsPanel from '../components/AIInsightsPanel'
import RoleToggle from '../components/RoleToggle'
import LiveIndicator from '../components/LiveIndicator'
import WarRoomMode from '../components/WarRoomMode'
import StatCard from '../components/StatCard'
import TimelinePanel from '../components/TimelinePanel'
import StressExplainabilityPanel from '../components/StressExplainabilityPanel'
import SLARiskPanel from '../components/SLARiskPanel'
import DecisionLogPanel from '../components/DecisionLogPanel'
import LiveEventStream from '../components/LiveEventStream'
import PredictiveRiskPanel from '../components/PredictiveRiskPanel'
import { useMetricsStore } from '../store/metricsStore'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'sales', label: 'Sales', icon: ChartColumnBig },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'support', label: 'Support', icon: HandHelping },
  { id: 'cashflow', label: 'Cash Flow', icon: Wallet },
  { id: 'alerts', label: 'Alerts', icon: BellRing },
]

const currency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

export default function Dashboard() {
  const {
    metrics,
    stressScore,
    stressFactors,
    alerts,
    insights,
    actions,
    role,
    page,
    tick,
    isReplaying,
    warRoomManual,
    stressNudge,
    events,
    liveEvents,
    prediction,
    connected,
    decisionLog,
    setRole,
    setPage,
    setStressNudge,
    startSimulation,
    replayHistory,
    toggleWarRoom,
    acknowledgeAction,
  } = useMetricsStore()

  useEffect(() => {
    startSimulation()
  }, [startSimulation])

  const warRoomActive = stressScore > 75 || warRoomManual
  const stressPulse = stressScore > 70

  const sidebar = (
    <aside className="glass-card hidden w-64 flex-col rounded-2xl p-4 lg:flex">
      <h1 className="font-display text-xl font-bold text-white">OpsPulse</h1>
      <p className="mt-1 text-xs text-slate-400">Unified Business Health</p>

      <nav className="mt-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = page === item.id
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                active ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300 hover:bg-slate-800/60 hover:text-cyan-100'
              }`}
            >
              <Icon size={16} className="transition group-hover:scale-110" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <button
        onClick={toggleWarRoom}
        className="mt-auto rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/20"
      >
        {warRoomManual ? 'Disable' : 'Enable'} War Room
      </button>
    </aside>
  )

  const header = (
    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold text-white">Real-Time Operations Command Center</h2>
        <p className="text-sm text-slate-400">Live backend event stream • updates every 1-3s</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-200">Simulate Stress</p>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={35}
              value={stressNudge}
              onChange={(event) => setStressNudge(Number(event.target.value))}
              className="h-1.5 w-28 cursor-pointer accent-indigo-400"
            />
            <span className="w-7 text-right text-xs text-indigo-100">{stressNudge}</span>
          </div>
        </div>
        <button
          onClick={replayHistory}
          disabled={isReplaying}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-500/20 disabled:opacity-50"
        >
          <RotateCw size={14} /> Replay Last 5 Minutes
        </button>
        <RoleToggle role={role} onChange={setRole} />
        <LiveIndicator tick={tick} isReplaying={isReplaying} />
      </div>
    </div>
  )

  const overview = (
    <>
      <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue Today" value={currency(metrics.sales.revenueToday)} tone="cyan" stressPulse={stressPulse} />
        <StatCard label="Orders / Min" value={metrics.sales.ordersPerMinute} tone="emerald" stressPulse={stressPulse} />
        <StatCard label="Open Tickets" value={metrics.support.openTickets} tone="amber" stressPulse={stressPulse} />
        <StatCard label="Net Cash" value={currency(metrics.cashFlow.revenue - metrics.cashFlow.expenses)} tone="rose" stressPulse={stressPulse} />
      </div>

      {warRoomActive && <div className="mb-4"><WarRoomMode alerts={alerts} actions={actions} metrics={metrics} onExit={toggleWarRoom} /></div>}

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <StressScoreGauge score={stressScore} factors={stressFactors} />
        </div>
        <div className="xl:col-span-8">
          <SalesChart data={metrics.sales.series} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4"><InventoryCard inventory={metrics.inventory} /></div>
        <div className="xl:col-span-4"><SupportCard support={metrics.support} /></div>
        <div className="xl:col-span-4"><CashFlowChart data={metrics.cashFlow.series} /></div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5"><AlertsPanel alerts={alerts} /></div>
        <div className="xl:col-span-7"><AIInsightsPanel insights={insights} actions={actions} onActionClick={acknowledgeAction} isReplaying={isReplaying} /></div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5"><TimelinePanel events={events} /></div>
        <div className="xl:col-span-3"><StressExplainabilityPanel factors={stressFactors} score={stressScore} /></div>
        <div className="xl:col-span-4"><SLARiskPanel support={metrics.support} /></div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7"><LiveEventStream events={liveEvents} connected={connected} /></div>
        <div className="xl:col-span-5"><PredictiveRiskPanel prediction={prediction} /></div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-12"><DecisionLogPanel logs={decisionLog} /></div>
      </div>
    </>
  )

  const ownerView = (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Revenue Today" value={currency(metrics.sales.revenueToday)} tone="cyan" stressPulse={stressPulse} />
        <StatCard label="Stress Score" value={stressScore.toFixed(1)} tone="rose" stressPulse={stressPulse} />
        <StatCard label="Orders / Min" value={metrics.sales.ordersPerMinute} tone="emerald" stressPulse={stressPulse} />
      </div>
      {warRoomActive && <WarRoomMode alerts={alerts} actions={actions} metrics={metrics} onExit={toggleWarRoom} />}
      <div className="grid gap-4 lg:grid-cols-2">
        <StressScoreGauge score={stressScore} factors={stressFactors} />
        <SalesChart data={metrics.sales.series} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <CashFlowChart data={metrics.cashFlow.series} />
        <AlertsPanel alerts={alerts} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <TimelinePanel events={events} />
        <StressExplainabilityPanel factors={stressFactors} score={stressScore} />
        <DecisionLogPanel logs={decisionLog} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <LiveEventStream events={liveEvents} connected={connected} />
        <PredictiveRiskPanel prediction={prediction} />
      </div>
    </div>
  )

  const operationsView = (
    <div className="space-y-4">
      {warRoomActive && <WarRoomMode alerts={alerts} actions={actions} metrics={metrics} onExit={toggleWarRoom} />}
      <div className="grid gap-4 lg:grid-cols-2">
        <InventoryCard inventory={metrics.inventory} />
        <SupportCard support={metrics.support} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <AlertsPanel alerts={alerts} />
        <AIInsightsPanel insights={insights} actions={actions} onActionClick={acknowledgeAction} isReplaying={isReplaying} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <SLARiskPanel support={metrics.support} />
        <TimelinePanel events={events} />
        <DecisionLogPanel logs={decisionLog} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <LiveEventStream events={liveEvents} connected={connected} />
        <PredictiveRiskPanel prediction={prediction} />
      </div>
    </div>
  )

  const sectionMap = {
    dashboard: overview,
    sales: <div className="space-y-4"><SalesChart data={metrics.sales.series} /><LiveEventStream events={liveEvents} connected={connected} /></div>,
    inventory: <div className="space-y-4"><InventoryCard inventory={metrics.inventory} /><PredictiveRiskPanel prediction={prediction} /></div>,
    support: <div className="space-y-4"><SupportCard support={metrics.support} /><SLARiskPanel support={metrics.support} /><TimelinePanel events={events} /></div>,
    cashflow: <div className="space-y-4"><CashFlowChart data={metrics.cashFlow.series} /><StressExplainabilityPanel factors={stressFactors} score={stressScore} /></div>,
    alerts: <AlertsPanel alerts={alerts} />,
  }

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="mx-auto flex max-w-[1600px] gap-4">
        {sidebar}

        <main className="flex-1">
          {header}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = page === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                    active
                      ? 'border-cyan-400/40 bg-cyan-500/20 text-cyan-100'
                      : 'border-slate-700 bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <Icon size={13} />
                  {item.label}
                </button>
              )
            })}
            <button
              onClick={toggleWarRoom}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-100"
            >
              <Siren size={13} />
              {warRoomManual ? 'Disable' : 'Enable'} War Room
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {page === 'dashboard' ? (role === 'owner' ? ownerView : operationsView) : sectionMap[page]}
          </motion.div>

          <div className="mt-4 rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 text-xs text-slate-400">
            <p className="inline-flex items-center gap-2">
              <Siren size={12} className={warRoomActive ? 'text-rose-300' : 'text-slate-500'} />
              War Room auto-activates above stress score 75. Current score: {stressScore.toFixed(1)}
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
