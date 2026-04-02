import { describe, it, expect } from "vitest";
import { calculateRewards, type MiningInput } from "../lib/mining-calculations";

describe("mining-calculations calculateRewards", () => {
  it("zeros, monthly×30, stake multipliers, APY, precision, reference, large HR", () => {
    const z = calculateRewards({ adjustedHashrate: 0, stake: 0 });
    expect(z.daily).toBe(0);
    expect(z.monthly).toBe(0);
    expect(z.apy).toBe(15);

    const mid = calculateRewards({ adjustedHashrate: 100, stake: 1000 });
    expect(mid.monthly).toBeCloseTo(mid.daily * 30, 1);

    const base = calculateRewards({ adjustedHashrate: 10, stake: 0 });
    expect(calculateRewards({ adjustedHashrate: 10, stake: 10_000 }).daily).toBeCloseTo(
      base.daily * 2,
      3,
    );
    expect(calculateRewards({ adjustedHashrate: 10, stake: 5_000 }).daily).toBeCloseTo(
      base.daily * 1.5,
      3,
    );

    expect(calculateRewards({ adjustedHashrate: 0, stake: 0 }).apy).toBe(15);
    const r100 = calculateRewards({ adjustedHashrate: 100, stake: 0 });
    const r200 = calculateRewards({ adjustedHashrate: 200, stake: 0 });
    expect(r200.apy - r100.apy).toBeCloseTo(10, 1);
    const r1k = calculateRewards({ adjustedHashrate: 0, stake: 1_000 });
    const r2k = calculateRewards({ adjustedHashrate: 0, stake: 2_000 });
    expect(r2k.apy - r1k.apy).toBeCloseTo(1, 1);

    const fmt = calculateRewards({ adjustedHashrate: 1, stake: 1 });
    expect((fmt.daily.toString().split(".")[1] ?? "").length).toBeLessThanOrEqual(4);
    expect((fmt.monthly.toString().split(".")[1] ?? "").length).toBeLessThanOrEqual(2);
    expect((fmt.apy.toString().split(".")[1] ?? "").length).toBeLessThanOrEqual(1);

    const input: MiningInput = { adjustedHashrate: 100, stake: 5_000 };
    const ref = calculateRewards(input);
    expect(ref.daily).toBe(1.23);
    expect(ref.monthly).toBe(36.9);
    expect(ref.apy).toBe(30);

    const big = calculateRewards({ adjustedHashrate: 1_000_000, stake: 0 });
    expect(big.daily).toBeGreaterThan(0);
    expect(Number.isFinite(big.apy)).toBe(true);
  });
});
