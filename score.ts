import type { Direction, SignalAssessment, SignalComponent, Underlying, MarketRegime } from "@/types/market";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/** Transparent weighted score. Inputs must be normalised -100..100. This is not a probability. */
export function assessSignal(input: {
  underlying: Underlying;
  regime: MarketRegime;
  components: SignalComponent[];
  dataValid: boolean;
  evaluatedAt?: string;
}): SignalAssessment {
  const available = input.components.filter((c) => c.available && c.weight > 0);
  const totalWeight = available.reduce((sum, c) => sum + c.weight, 0);
  const score = totalWeight > 0
    ? clamp(available.reduce((sum, c) => sum + clamp(c.score, -100, 100) * c.weight, 0) / totalWeight, -100, 100)
    : 0;
  const positive = available.some((c) => c.score >= 25);
  const negative = available.some((c) => c.score <= -25);
  let direction: Direction = "NEUTRAL";
  if (!input.dataValid || available.length < 3) direction = "NO_TRADE";
  else if (positive && negative && Math.abs(score) < 40) direction = "CONFLICTING";
  else if (score >= 60) direction = "BULLISH";
  else if (score >= 25) direction = "BULLISH";
  else if (score <= -60) direction = "BEARISH";
  else if (score <= -25) direction = "BEARISH";
  else direction = "NEUTRAL";
  const aligned = available.length ? available.filter((c) => Math.sign(c.score) === Math.sign(score) && Math.abs(c.score) >= 25).length / available.length : 0;
  const confirmation = !input.dataValid || available.length < 3 ? "LOW" : aligned >= 0.75 ? "HIGH" : aligned >= 0.5 ? "MEDIUM" : "LOW";
  return {
    underlying: input.underlying, score: Math.round(score), direction, regime: input.regime,
    confirmation, dataValid: input.dataValid,
    reasons: input.dataValid ? available.map((c) => `${c.name}: ${c.explanation}`) : ["Essential market data is stale, missing or invalid; actionable signals are blocked."],
    components: input.components, evaluatedAt: input.evaluatedAt ?? new Date().toISOString()
  };
}
