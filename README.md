# OpsPulse — Unified Business Health Dashboard for SMBs

OpsPulse is now a full-stack real-time operational intelligence platform. It streams business events, computes stress on the backend, stores events in MongoDB, and powers a live dashboard for SMB operators.

## Stack

- Frontend: React + Vite, TailwindCSS, Recharts, Framer Motion, Zustand
- Backend: Node.js, Express, Socket.io, MongoDB (Mongoose)

## Core Full-Stack Features

- Business Event Engine emits events every `1-3` seconds
- MongoDB `BusinessEvent` schema stores all generated events
- Socket.io stream broadcasts:
  - `newEvent`
  - `updatedMetrics`
  - `updatedStressScore`
  - `alerts`
- Stress engine moved to backend
- Event-driven alert generation (crisis/opportunity/anomaly)
- Predictive risk engine for stockout/SLA risk windows
- Live Event Stream panel (last 20 events)
- Stress Breakdown Engine (`RootCausePanel`) with factor-wise contribution bars and primary-cause detection

## API Endpoints

- `GET /api/metrics`
- `GET /api/events?limit=20`
- `GET /api/alerts`
- `GET /api/stress-score`
- `POST /api/ingest/event` (external business API ingestion)
- `GET /health`

## Environment

Create `.env` from `.env.example`.

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/opspulse
CLIENT_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

## Run

```bash
npm install
npm run dev:full
```

Alternative (separate terminals):

```bash
npm run server:dev
npm run dev
```

## Build Frontend

```bash
npm run build
npm run preview
```

## Notes

- If MongoDB is unavailable, backend continues streaming in memory and serves fallbacks.
- Stress formula remains:
  - `0.35 × Inventory Risk`
  - `0.30 × Sales Drop`
  - `0.20 × Support Load`
  - `0.15 × Cash Flow Pressure`
- War Room mode auto-activates above stress score `75` and highlights root cause in red.
- `RootCausePanel` slides in when stress exceeds `50` and updates live from backend stress factor stream.

See `STRESS_FORMULA_JUSTIFICATION.md` for judge-facing formula rationale.
