import type { FeedHealth, IndexQuote, OptionQuote, Underlying } from "@/types/market";
import type { MarketDataProvider } from "./market-data-provider";

/** Deterministic demo data only. Never present these values as live market prices. */
export class MockMarketDataProvider implements MarketDataProvider {
  readonly name = "MOCK — illustrative data";
  async getFeedHealth(): Promise<FeedHealth> {
    return { provider: this.name, connected: false, lastTickAt: null, delayMs: null, stale: true, message: "Demo mode. Connect a verified provider before using live signals." };
  }
  async getIndexQuotes(underlyings: Underlying[]): Promise<IndexQuote[]> {
    const sample: Record<Underlying, IndexQuote> = {
      NIFTY: { underlying: "NIFTY", label: "NIFTY 50", ltp: 25100, changePct: 0.42, timestamp: null, source: "MOCK" },
      BANKNIFTY: { underlying: "BANKNIFTY", label: "BANK NIFTY", ltp: 56800, changePct: -0.18, timestamp: null, source: "MOCK" },
      SENSEX: { underlying: "SENSEX", label: "SENSEX", ltp: 82100, changePct: 0.21, timestamp: null, source: "MOCK" }
    };
    return underlyings.map((key) => sample[key]);
  }
  async getOptionChain(underlying: Underlying, expiry: string): Promise<OptionQuote[]> {
    const centre = underlying === "NIFTY" ? 25100 : underlying === "BANKNIFTY" ? 56800 : 82100;
    const step = underlying === "BANKNIFTY" ? 100 : 100;
    return Array.from({ length: 11 }, (_, i) => {
      const strike = Math.round(centre / step) * step + (i - 5) * step;
      const distance = Math.abs(strike - centre) / step;
      return (["CE", "PE"] as const).map((optionType) => ({
        instrumentKey: `MOCK|${underlying}|${expiry}|${strike}|${optionType}`,
        underlying, expiry, strike, optionType,
        ltp: Math.max(8, 180 - distance * 24 + (optionType === "CE" ? (centre - strike) : (strike - centre)) * 0.01),
        bid: null, ask: null, volume: 1000 + (10 - distance) * 250,
        oi: 12000 + Math.round((10 - distance) * 3200), previousOi: 11000 + Math.round((10 - distance) * 3000),
        iv: 14 + distance * 0.4, delta: optionType === "CE" ? Math.max(0.05, 0.5 - distance * 0.08) : -Math.max(0.05, 0.5 - distance * 0.08),
        gamma: 0.0005, theta: -12, vega: 8, timestamp: null
      }));
    }).flat();
  }
}
