import { describe, it, expect } from "vitest";
import { calculateRewards } from "../lib/mining-calc";

describe("mining-calc calculateRewards", () => {
  it("zeros, linear hashrate, stake tiers, APY deltas, precision", () => {
    const z = calculateRewards({ adjustedHashrate: 0, stake: 0 });
    expect(z.daily).toBe(0);
    expect(z.monthly).toBe(0);
    expect(z.apy).toBe(15);

    const r10 = calculateRewards({ adjustedHashrate: 10, stake: 0 });
    const r20 = calculateRewards({ adjustedHashrate: 20, stake: 0 });
    expect(r20.daily).toBeCloseTo(r10.daily * 2, 2);
    expect(calculateRewards({ adjustedHashrate: 10, stake: 0 }).daily).toBe(0.082);
    expect(r10.monthly).toBeCloseTo(r10.daily * 30, 2);

    const noStake = calculateRewards({ adjustedHashrate: 10, stake: 0 });
    const maxStake = calculateRewards({ adjustedHashrate: 10, stake: 10_000 });
    expect(maxStake.daily).toBeCloseTo(noStake.daily * 2, 4);
    expect(calculateRewards({ adjustedHashrate: 10, stake: 5_000 }).daily).toBeCloseTo(
      10 * 0.0082 * 1.5,
      4,
    );

    const baseApy = calculateRewards({ adjustedHashrate: 0, stake: 0 }).apy;
    expect(calculateRewards({ adjustedHashrate: 10, stake: 0 }).apy - baseApy).toBeCloseTo(1, 1);
    expect(calculateRewards({ adjustedHashrate: 0, stake: 1_000 }).apy - baseApy).toBeCloseTo(1, 1);
    expect(calculateRewards({ adjustedHashrate: 50, stake: 5_000 }).apy).toBeCloseTo(25, 1);

    const prec = calculateRewards({ adjustedHashrate: 7, stake: 3_500 });
    expect((prec.daily.toString().split(".")[1] ?? "").length).toBeLessThanOrEqual(4);
    expect((prec.monthly.toString().split(".")[1] ?? "").length).toBeLessThanOrEqual(2);
    expect((prec.apy.toString().split(".")[1] ?? "").length).toBeLessThanOrEqual(1);
  });
});
