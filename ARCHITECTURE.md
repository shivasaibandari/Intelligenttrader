# Architecture and integration notes

## Flow
Provider REST/WebSocket -> server-side provider adapter -> normalisation/validation -> live cache and persistence -> indicator/Greeks/positioning services -> signal and risk engine -> alert manager -> Next.js dashboard.

## Provider adapter contract
`MarketDataProvider` intentionally has no broker-specific implementation. Add one adapter folder per selected provider. Keep provider response schemas and symbol mapping inside the adapter. Convert into `types/market.ts` only after validation.

## Historical data rule
Historical candles for individual option contracts do not imply historical full-chain snapshots. If the provider does not offer historical chain snapshots, begin capturing snapshots prospectively (subject to licence and retention terms). Historical tests of OI/PCR signals must not claim coverage for periods where chain snapshots are absent.

## Recommended persistence tables
- instruments: provider key, exchange, underlying, expiry, strike, type, lot size, active dates.
- market_ticks: instrument key, exchange timestamp, ingestion timestamp, LTP, bid/ask, volume, OI, source.
- option_chain_snapshots: snapshot timestamp, underlying, expiry, strike, CE/PE quote and Greeks.
- candles: instrument, interval, timestamp, OHLCV, OI where supplied.
- signals: strategy version, component scores, final score, data-health flags, explanation and invalidation.
- alerts: signal id, state, deduplication key, delivery state, timestamps.
- paper_trades: contract, quantity, planned entry/exit, actual simulated fills, costs and notes.

## Environment
Use `.env.example` as a starting point. Keep credentials in server-only environment variables. Do not prefix secrets with `NEXT_PUBLIC_`.
