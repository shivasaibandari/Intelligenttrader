export type PositioningRead = "POSSIBLE_LONG_BUILDUP" | "POSSIBLE_SHORT_BUILDUP" | "POSSIBLE_SHORT_COVERING" | "POSSIBLE_LONG_UNWINDING" | "INCONCLUSIVE";

/** Heuristic only: option premium is affected by spot, IV and time decay. */
export function classifyOptionChange(input: { premiumPct: number | null; oiPct: number | null; ivPct?: number | null }): PositioningRead {
  if (input.premiumPct == null || input.oiPct == null) return "INCONCLUSIVE";
  if (Math.abs(input.premiumPct) < 0.1 || Math.abs(input.oiPct) < 0.1) return "INCONCLUSIVE";
  if (input.premiumPct > 0 && input.oiPct > 0) return "POSSIBLE_LONG_BUILDUP";
  if (input.premiumPct < 0 && input.oiPct > 0) return "POSSIBLE_SHORT_BUILDUP";
  if (input.premiumPct > 0 && input.oiPct < 0) return "POSSIBLE_SHORT_COVERING";
  if (input.premiumPct < 0 && input.oiPct < 0) return "POSSIBLE_LONG_UNWINDING";
  return "INCONCLUSIVE";
}
