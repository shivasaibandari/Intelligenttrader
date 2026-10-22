import type { FeedHealth, IndexQuote, OptionQuote, Underlying } from "@/types/market";

/** Provider-neutral boundary. Implement only after verifying provider entitlements and terms. */
export interface MarketDataProvider {
  readonly name: string;
  getFeedHealth(): Promise<FeedHealth>;
  getIndexQuotes(underlyings: Underlying[]): Promise<IndexQuote[]>;
  getOptionChain(underlying: Underlying, expiry: string): Promise<OptionQuote[]>;
  subscribe?(instrumentKeys: string[], onUpdate: (event: MarketUpdate) => void): Promise<() => Promise<void>>;
}
export type MarketUpdate =
  | { type: "index"; quote: IndexQuote }
  | { type: "option"; quote: OptionQuote };

/** Historical chain snapshots are deliberately a separate capability, not implied by candle history. */
export interface HistoricalOptionsCapability {
  getHistoricalOptionCandles(instrumentKey: string, from: string, to: string, interval: string): Promise<unknown>;
  getHistoricalOptionChainSnapshots?(underlying: Underlying, from: string, to: string): Promise<unknown>;
}
