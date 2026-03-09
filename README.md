# OpsPulse — Unified Business Health Dashboard for SMBs

OpsPulse is a real-time SaaS-style operations dashboard built for hackathon evaluation. It unifies simulated data across Sales, Inventory, Support, and Cash Flow into a single decision layer with intelligent alerts, role-based views, and crisis-focused War Room mode.

## Stack

- React + Vite
- TailwindCSS
- Recharts
- Framer Motion
- Zustand
- Lucide React

## Key Features Implemented

- Live data simulation every 2 seconds via `setInterval`
- Weighted **Business Stress Score** (`0-100`) with animated gauge
- Real-time live indicator pulse and update cycle
- Intelligent alert feed with 3 classes:
  - Crisis Alerts
  - Opportunity Alerts
  - Anomaly Alerts
- Dual-role dashboard modes:
  - Business Owner
  - Operations Manager
- War Room Mode for high stress (`score > 75`) + manual toggle
- Rule-based AI insights and recommended actions
- Replay engine for last 5 minutes from stored snapshots
- Functional sidebar + mobile navigation buttons
- Simulate Stress slider for demo control
- Neon dark glassmorphism UI with hover transitions

## Unique Features

- Scenario Presets: `Normal`, `Flash Sale`, `Supplier Delay`, `Payment Failure` to shift real-time simulator behavior.
- Last-60s Change Timeline: auto-generated positive/negative operational events and alert-derived updates.
- Stress Explainability: weighted factor contribution bars for transparent score interpretation.
- Support SLA Risk: estimated breach timer from queue size, growth, and response latency.
- Decision Log: clicking a recommended action records it with timestamp and applies temporary mitigation to stress factors.

## Project Structure

```
src/
  components/
    AIInsightsPanel.jsx
    AlertsPanel.jsx
    CashFlowChart.jsx
    InventoryCard.jsx
    InventoryHealthCard.jsx
    LiveIndicator.jsx
    RoleToggle.jsx
    SalesChart.jsx
    StatCard.jsx
    StressScoreGauge.jsx
    SupportCard.jsx
    SupportLoadCard.jsx
    WarRoomMode.jsx
  pages/
    Dashboard.jsx
  store/
    metricsStore.js
  utils/
    alertEngine.js
    dataSimulator.js
    stressCalculator.js
  App.jsx
  index.css
  main.jsx
```

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Stress Score Formula

```
Stress Score =
0.35 × Inventory Risk +
0.30 × Sales Drop +
0.20 × Support Load +
0.15 × Cash Flow Pressure
```

See `STRESS_FORMULA_JUSTIFICATION.md` for business logic and rationale.
