import { describe, it, expect } from "vitest";
import { calculateRewards } from "../lib/mining";

describe("calculateRewards", () => {
  // ── baseline (no stake) ────────────────────────────────────────────────────

  it("returns correct daily reward for 1 TH/s with zero stake", () => {
    const result = calculateRewards({ adjustedHashrate: 1, stake: 0 });
    // stakeMultiplier = 1 + 0/10_000 = 1
    // daily = 1 * 0.0082 * 1 = 0.0082
    expect(result.daily).toBe(0.0082);
  });

  it("returns correct monthly reward (daily × 30)", () => {
    const result = calculateRewards({ adjustedHashrate: 1, stake: 0 });
    // monthly = 0.0082 * 30 = 0.246
    expect(result.monthly).toBe(0.25);
  });

  it("returns correct baseline APY with no stake and no hashrate", () => {
    const result = calculateRewards({ adjustedHashrate: 0, stake: 0 });
    // apy = 15 + 0/1_000 + 0*0.1 = 15
    expect(result.apy).toBe(15.0);
  });

  // ── stake multiplier ───────────────────────────────────────────────────────

  it("doubles daily reward at maximum stake (10,000 BTC-S)", () => {
    const noStake = calculateRewards({ adjustedHashrate: 1, stake: 0 });
    const maxStake = calculateRewards({ adjustedHashrate: 1, stake: 10_000 });
    // stakeMultiplier = 1 + 10_000/10_000 = 2 → reward doubles
    expect(maxStake.daily).toBeCloseTo(noStake.daily * 2, 4);
  });

  it("applies 50 % stake boost at 5,000 BTC-S", () => {
    const noStake = calculateRewards({ adjustedHashrate: 2, stake: 0 });
    const halfStake = calculateRewards({ adjustedHashrate: 2, stake: 5_000 });
    expect(halfStake.daily).toBeCloseTo(noStake.daily * 1.5, 4);
  });

  // ── APY calculation ────────────────────────────────────────────────────────

  it("adds hashrate bonus to APY", () => {
    const result = calculateRewards({ adjustedHashrate: 10, stake: 0 });
    // apy = 15 + 0 + 10*0.1 = 16
    expect(result.apy).toBe(16.0);
  });

  it("adds stake bonus to APY", () => {
    const result = calculateRewards({ adjustedHashrate: 0, stake: 2_000 });
    // apy = 15 + 2_000/1_000 + 0 = 17
    expect(result.apy).toBe(17.0);
  });

  it("combines hashrate and stake bonuses in APY", () => {
    const result = calculateRewards({ adjustedHashrate: 5, stake: 1_000 });
    // apy = 15 + 1 + 0.5 = 16.5
    expect(result.apy).toBe(16.5);
  });

  // ── rounding & precision ───────────────────────────────────────────────────

  it("rounds daily to 4 decimal places", () => {
    const result = calculateRewards({ adjustedHashrate: 0.5, stake: 100 });
    const decimals = result.daily.toString().split(".")[1]?.length ?? 0;
    expect(decimals).toBeLessThanOrEqual(4);
  });

  it("rounds monthly to 2 decimal places", () => {
    const result = calculateRewards({ adjustedHashrate: 0.5, stake: 100 });
    const decimals = result.monthly.toString().split(".")[1]?.length ?? 0;
    expect(decimals).toBeLessThanOrEqual(2);
  });

  it("rounds APY to 1 decimal place", () => {
    const result = calculateRewards({ adjustedHashrate: 0.5, stake: 100 });
    const decimals = result.apy.toString().split(".")[1]?.length ?? 0;
    expect(decimals).toBeLessThanOrEqual(1);
  });

  // ── edge cases ─────────────────────────────────────────────────────────────

  it("handles zero hashrate and zero stake", () => {
    const result = calculateRewards({ adjustedHashrate: 0, stake: 0 });
    expect(result.daily).toBe(0);
    expect(result.monthly).toBe(0);
    expect(result.apy).toBe(15.0);
  });

  it("handles high hashrate (dedicated node equivalent)", () => {
    // Dedicated node: 50 TH/s × 1.2 efficiency = 60 adjusted TH/s
    const result = calculateRewards({ adjustedHashrate: 60, stake: 0 });
    expect(result.daily).toBeGreaterThan(0);
    expect(result.monthly).toBeCloseTo(result.daily * 30, 2);
  });
});
