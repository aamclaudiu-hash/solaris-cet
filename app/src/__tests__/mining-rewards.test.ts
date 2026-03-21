import { describe, it, expect } from "vitest";
import { calculateRewards } from "../lib/mining-math";

describe("calculateRewards", () => {
  it("returns zero daily reward for zero hashrate with no stake", () => {
    const result = calculateRewards({ adjustedHashrate: 0, stake: 0 });
    expect(result.daily).toBe(0);
    expect(result.monthly).toBe(0);
  });

  it("returns base APY of 15 % when hashrate and stake are both zero", () => {
    const result = calculateRewards({ adjustedHashrate: 0, stake: 0 });
    expect(result.apy).toBe(15);
  });

  it("daily × 30 equals monthly (within floating-point rounding)", () => {
    const result = calculateRewards({ adjustedHashrate: 2.5, stake: 500 });
    // monthly is independently rounded, so allow ±0.01 tolerance
    expect(result.monthly).toBeCloseTo(result.daily * 30, 1);
  });

  it("stake multiplier increases daily reward proportionally", () => {
    const base = calculateRewards({ adjustedHashrate: 1, stake: 0 });
    const staked = calculateRewards({ adjustedHashrate: 1, stake: 10_000 });
    // At max stake tier (10 000) stakeMultiplier = 2, so reward doubles
    expect(staked.daily).toBeCloseTo(base.daily * 2, 3);
  });

  it("APY increases with hashrate", () => {
    const low = calculateRewards({ adjustedHashrate: 1, stake: 0 });
    const high = calculateRewards({ adjustedHashrate: 10, stake: 0 });
    expect(high.apy).toBeGreaterThan(low.apy);
  });

  it("APY increases with stake", () => {
    const low = calculateRewards({ adjustedHashrate: 1, stake: 0 });
    const high = calculateRewards({ adjustedHashrate: 1, stake: 5_000 });
    expect(high.apy).toBeGreaterThan(low.apy);
  });

  it("returns results rounded to the correct decimal places", () => {
    const result = calculateRewards({ adjustedHashrate: 1, stake: 100 });
    // daily should have at most 4 decimal places
    expect(result.daily.toString().split(".")[1]?.length ?? 0).toBeLessThanOrEqual(4);
    // monthly should have at most 2 decimal places
    expect(result.monthly.toString().split(".")[1]?.length ?? 0).toBeLessThanOrEqual(2);
    // apy should have at most 1 decimal place
    expect(result.apy.toString().split(".")[1]?.length ?? 0).toBeLessThanOrEqual(1);
  });

  it("handles large hashrate values without throwing", () => {
    expect(() => calculateRewards({ adjustedHashrate: 1_000_000, stake: 9_000 })).not.toThrow();
  });
});
