import { describe, expect, it } from "vitest";
import { classifyOptionChange } from "@/lib/analytics/positioning";

describe("option positioning heuristic", () => {
  it("labels premium and OI both rising as possible long build-up", () => {
    expect(classifyOptionChange({ premiumPct: 2, oiPct: 4 })).toBe("POSSIBLE_LONG_BUILDUP");
  });
  it("returns inconclusive when input is missing", () => {
    expect(classifyOptionChange({ premiumPct: null, oiPct: 4 })).toBe("INCONCLUSIVE");
  });
});
