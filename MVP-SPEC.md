# Indian Index Options Intelligence — MVP Specification

## Product goal
A responsive Next.js dashboard for manual analysis of NIFTY 50, BANK NIFTY and SENSEX options. It provides market context, option-chain analytics, transparent signal evidence and alerts. It does not place orders in MVP.

## Non-goals for MVP
- No automated trading or broker order placement.
- No unverified claims of predictive accuracy or probability of profit.
- No scraping exchange web pages.
- No backtest of historical option-chain positioning until a suitable timestamped historical dataset is acquired.

## User stories
1. As a trader, I can choose an underlying and expiry and inspect CE/PE strikes with LTP, bid/ask, volume, OI, previous OI, IV and Greeks.
2. I can see whether the feed is connected, stale, incomplete or delayed.
3. I can see component scores and explanations before seeing an overall directional assessment.
4. I receive deduplicated alerts only when explicit conditions are satisfied.
5. I can record paper trades and later evaluate outcomes net of estimated transaction costs.

## Acceptance criteria
- Every market value has a source timestamp and provider identifier.
- Stale or missing essential data blocks actionable signals.
- Demo data is visibly labelled and cannot be confused with live data.
- Signal scores are explainable and are not presented as probabilities.
- Alerts include trigger, invalidation, timestamp and the evidence that triggered them.
- Historical tests use only data available at the simulated time and include realistic spread/slippage assumptions.
- No API secret is sent to client-side JavaScript.

## Data contract
- Index quote: underlying, LTP, change %, source timestamp, source.
- Option quote: provider instrument key, underlying, expiry, strike, CE/PE, LTP, bid, ask, volume, OI, previous OI, IV, Delta, Gamma, Theta, Vega, source timestamp.
- Snapshot: snapshot timestamp, underlying value and a full selected-expiry strike ladder. Persist snapshots at a configurable cadence during market hours only if provider terms permit storage.
- Historical capability flags: option candles and full option-chain snapshots must be represented separately. Do not infer one from the other.

## Signal engine v0
- Regime: trending up/down, range-bound, volatility expansion, unknown.
- Price: VWAP, EMA 9/20, RSI 14, ATR 14, prior-day levels and opening range.
- Derivatives: OI change, premium change, IV change, PCR OI and volume PCR; compare adjacent strikes and underlying/futures context.
- Score: weighted normalised component scores in [-100, 100]. Initial weights are configuration, not validated strategy parameters.
- Gate: require valid/fresh data, sufficient available components, setup-specific confirmation and risk checks. If conflicting or stale, return CONFLICTING/NO_TRADE.
- Alert: state machine with watch, confirmed, invalidated, expired and cooldown states.

## Provider acceptance checklist
- Verify support for each target underlying and exchange (especially BSE SENSEX derivatives).
- Verify current API endpoints, auth lifecycle, market hours, rate limits and WebSocket reconnect behaviour.
- Verify fields for LTP, bid/ask, volume, OI/previous OI, IV and Greeks; document whether Greeks are provider-calculated.
- Verify whether option-chain endpoint is a snapshot and its cadence/limits.
- Verify historical option candles and expired contracts separately from historical full-chain snapshots.
- Verify permitted personal use, display, persistence, retention and redistribution.
- Run a session-long soak test and compare selected samples to an independent licensed source.

## Security and operations
- Keep provider credentials server-side; use environment secrets.
- Validate all incoming records with schemas and reject invalid timestamps/negative values where impossible.
- Store exchange timestamp and ingestion timestamp separately.
- Monitor connection status, age of last tick, missing contracts, API errors, reconnects and clock skew.
- Disable alerts on stale data; provide a manual kill switch.

## Release plan
1. Mock dashboard and provider interface.
2. One provider adapter and live data validation.
3. Persistence and intraday snapshot capture.
4. Rule-based signals and alert lifecycle.
5. Paper trading and historical testing after data availability is verified.
