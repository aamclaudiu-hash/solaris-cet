import { describe, it, expect } from "vitest";

/**
 * Unit tests for the mining reward calculation logic extracted from
 * app/src/workers/mining.worker.ts.
 *
 * These tests run in a Node environment (no DOM/Worker API needed) and verify
 * that the calculation formulae produce correct, deterministic results for
 * the inputs described in the Solaris CET whitepaper.
 */

// ---------------------------------------------------------------------------
// Replicate the pure calculation function here so it can be tested without
// instantiating a Web Worker.
// ---------------------------------------------------------------------------

interface MiningInput {
  adjustedHashrate: number;
  stake: number;
}

interface MiningResult {
  daily: number;
  monthly: number;
  apy: number;
}

function calculateRewards(input: MiningInput): MiningResult {
  const { adjustedHashrate, stake } = input;
  const stakeMultiplier = 1 + stake / 10_000;
  const daily = adjustedHashrate * 0.0082 * stakeMultiplier;
  const monthly = daily * 30;
  const apy = 15 + stake / 1_000 + adjustedHashrate * 0.1;

  return {
    daily: Number(daily.toFixed(4)),
    monthly: Number(monthly.toFixed(2)),
    apy: Number(apy.toFixed(1)),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("calculateRewards", () => {
  it("returns zero daily/monthly yield when hashrate is zero", () => {
    const result = calculateRewards({ adjustedHashrate: 0, stake: 0 });
    expect(result.daily).toBe(0);
    expect(result.monthly).toBe(0);
  });

  it("returns base APY of 15 when hashrate and stake are both zero", () => {
    const result = calculateRewards({ adjustedHashrate: 0, stake: 0 });
    expect(result.apy).toBe(15);
  });

  it("daily yield scales linearly with hashrate when stake is zero", () => {
    const r1 = calculateRewards({ adjustedHashrate: 1, stake: 0 });
    const r2 = calculateRewards({ adjustedHashrate: 2, stake: 0 });
    expect(r2.daily).toBeCloseTo(r1.daily * 2, 4);
  });

  it("monthly yield is approximately 30× daily yield (within rounding tolerance)", () => {
    const result = calculateRewards({ adjustedHashrate: 2.5, stake: 500 });
    // Both values are independently rounded, so allow for rounding error of ~0.01
    expect(result.monthly).toBeCloseTo(result.daily * 30, 0);
  });

  it("stake multiplier increases yield proportionally", () => {
    const withoutStake = calculateRewards({ adjustedHashrate: 1, stake: 0 });
    const withMaxStake = calculateRewards({ adjustedHashrate: 1, stake: 10_000 });
    // stakeMultiplier at 10,000 is 2.0 → yield should double
    expect(withMaxStake.daily).toBeCloseTo(withoutStake.daily * 2, 4);
  });

  it("APY increases by 0.1 per TH/s", () => {
    const r1 = calculateRewards({ adjustedHashrate: 0, stake: 0 });
    const r2 = calculateRewards({ adjustedHashrate: 10, stake: 0 });
    expect(r2.apy - r1.apy).toBeCloseTo(1.0, 1);
  });

  it("APY increases by 1 per 1000 BTC-S staked", () => {
    const r1 = calculateRewards({ adjustedHashrate: 0, stake: 0 });
    const r2 = calculateRewards({ adjustedHashrate: 0, stake: 1_000 });
    expect(r2.apy - r1.apy).toBeCloseTo(1.0, 1);
  });

  it("results are rounded to correct decimal places", () => {
    const result = calculateRewards({ adjustedHashrate: 0.5, stake: 100 });
    const dailyStr = result.daily.toString();
    const monthlyStr = result.monthly.toString();
    const apyStr = result.apy.toString();
    // daily: up to 4 decimal places
    const dailyDecimals = dailyStr.includes(".") ? dailyStr.split(".")[1].length : 0;
    // monthly: up to 2 decimal places
    const monthlyDecimals = monthlyStr.includes(".") ? monthlyStr.split(".")[1].length : 0;
    // apy: up to 1 decimal place
    const apyDecimals = apyStr.includes(".") ? apyStr.split(".")[1].length : 0;
    expect(dailyDecimals).toBeLessThanOrEqual(4);
    expect(monthlyDecimals).toBeLessThanOrEqual(2);
    expect(apyDecimals).toBeLessThanOrEqual(1);
  });

  it("handles typical smartphone device configuration", () => {
    // Smartphone: baseHashrate 0.5, efficiency 0.8
    const adjustedHashrate = 0.5 * 0.8; // 0.4
    const result = calculateRewards({ adjustedHashrate, stake: 0 });
    expect(result.daily).toBeGreaterThan(0);
    expect(result.monthly).toBeGreaterThan(result.daily);
  });

  it("handles dedicated node configuration", () => {
    // Dedicated node: baseHashrate 50.0, efficiency 1.2
    const adjustedHashrate = 50.0 * 1.2; // 60
    const result = calculateRewards({ adjustedHashrate, stake: 5_000 });
    expect(result.daily).toBeGreaterThan(0);
    expect(result.apy).toBeGreaterThan(15);
  });
});
