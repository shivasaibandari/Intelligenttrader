export type Underlying = "NIFTY" | "BANKNIFTY" | "SENSEX";
export type OptionType = "CE" | "PE";
export type MarketRegime = "TRENDING_UP" | "TRENDING_DOWN" | "RANGE_BOUND" | "VOLATILITY_EXPANSION" | "UNKNOWN";
export type Direction = "BULLISH" | "BEARISH" | "NEUTRAL" | "CONFLICTING" | "NO_TRADE";

export interface FeedHealth {
  provider: string;
  connected: boolean;
  lastTickAt: string | null;
  delayMs: number | null;
  stale: boolean;
  message: string;
}
export interface IndexQuote {
  underlying: Underlying;
  label: string;
  ltp: number | null;
  changePct: number | null;
  timestamp: string | null;
  source: string;
}
export interface OptionQuote {
  instrumentKey: string;
  underlying: Underlying;
  expiry: string;
  strike: number;
  optionType: OptionType;
  ltp: number | null;
  bid: number | null;
  ask: number | null;
  volume: number | null;
  oi: number | null;
  previousOi: number | null;
  iv: number | null;
  delta: number | null;
  gamma: number | null;
  theta: number | null;
  vega: number | null;
  timestamp: string | null;
}
export interface SignalComponent {
  name: string;
  score: number; // normalised -100..100
  weight: number; // 0..1
  explanation: string;
  available: boolean;
}
export interface SignalAssessment {
  underlying: Underlying;
  score: number;
  direction: Direction;
  regime: MarketRegime;
  confirmation: "LOW" | "MEDIUM" | "HIGH";
  dataValid: boolean;
  reasons: string[];
  components: SignalComponent[];
  evaluatedAt: string;
}
