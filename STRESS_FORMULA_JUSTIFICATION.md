# OpsPulse Stress Score Formula Justification

## Objective
The **Business Stress Score** condenses multi-vertical operational risk into a single signal that founders and operations managers can monitor in real-time. The score helps answer: _"How stressed is the business right now, and where should intervention happen first?"_

## Formula

**Stress Score =**
- `0.35 × Inventory Risk`
- `+ 0.30 × Sales Drop`
- `+ 0.20 × Support Load`
- `+ 0.15 × Cash Flow Pressure`

Final score is clamped to a `0–100` range.

## Why These Weights

### 1) Inventory Risk (35%) — highest priority
For small e-commerce businesses, stockouts immediately break revenue flow and customer trust. Inventory fragility creates direct operational blockage, so it carries the highest weight.

Signal basis:
- low-stock SKUs / total stock
- stock-health ratio

### 2) Sales Drop (30%) — second highest
A sustained drop in orders or sales trend is an immediate warning of market/funnel problems. It strongly impacts short-term viability and growth confidence.

Signal basis:
- negative sales trend
- weak orders-per-minute

### 3) Support Load (20%)
Support spikes generally lag product/fulfillment issues but are strong indicators of churn risk and quality degradation. High support stress affects retention and reputation.

Signal basis:
- open ticket volume
- ticket growth velocity
- response-time pressure

### 4) Cash Flow Pressure (15%)
Cash flow matters deeply, but in short simulation windows, inventory and demand issues often surface first. Cash pressure remains weighted, but not dominant in the immediate operational layer.

Signal basis:
- revenue vs expenses
- burn ratio
- net flow direction

## Interpretation Bands
- `0–30`: Healthy
- `31–60`: Warning
- `61–80`: High Stress
- `81–100`: Crisis

These bands map directly to UI states and operational urgency.

## Crisis and War Room Logic
When score crosses `75`, system enters **War Room Mode** to suppress noise and surface only immediately actionable items:
- crisis alerts
- inventory bottlenecks
- support overload
- net cash stress
- prioritized recommendations

## Business Logic Summary
The model prioritizes **continuity risks first** (inventory + sales), then **service strain** (support), then **financial pressure** (cash flow). This ordering reflects how SMB e-commerce failures typically emerge operationally before they fully manifest financially.
