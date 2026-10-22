# Options Intelligence — Starter

A provider-neutral Next.js starter for an Indian index-options analytics dashboard.

## Important
- The dashboard currently uses synthetic demo values.
- It is not connected to a broker or exchange.
- No live trading signals, alerts or order placement are implemented.
- Historical option-chain snapshots are a separate data capability from historical option candles and must be verified with the chosen provider.

## Requirements
- Node.js 20.9+ (recommended for this Next.js starter)
- npm

## Run locally
```bash
cp .env.example .env.local
npm install
npm run dev
```
Open http://localhost:3000.

## Quality checks
```bash
npm run typecheck
npm test
npm run build
```

## Project layout
```text
app/
  api/health/route.ts     health endpoint
  globals.css             responsive dashboard styles
  layout.tsx              app shell
  page.tsx                dashboard demo
lib/
  analytics/score.ts      transparent weighted signal helper
  analytics/positioning.ts heuristic positioning labels
  providers/               provider-neutral adapter contract and mock
 types/market.ts           canonical market data types
docs/
  MVP-SPEC.md              scope and acceptance criteria
  ARCHITECTURE.md           data flow, persistence and integration notes
tests/                     starter unit tests
```

## Next steps
1. Choose a provider and verify target-exchange coverage, API entitlements and historical data.
2. Implement authentication on the server; never expose client secrets in the browser.
3. Build a provider adapter and instrument master synchronisation.
4. Capture timestamped option-chain snapshots if the licence permits it.
5. Add persistence, feed-health gates, alert lifecycle and paper trading.
