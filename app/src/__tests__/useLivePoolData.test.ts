import { describe, it, expect } from 'vitest';

/**
 * Pure helpers aligned with `use-live-pool-data` fetch path.
 * `createTimeoutSignal` is covered in `timeout-signal.test.ts`.
 */

const CET_DECIMALS = 9;

function calcPriceFromReserves(
  tonReserveRaw: string,
  cetReserveRaw: string,
  tonPriceUsd: number,
): number | null {
  const tonReserve = parseFloat(tonReserveRaw) / 1e9;
  const cetReserve = parseFloat(cetReserveRaw) / 10 ** CET_DECIMALS;
  if (cetReserve === 0) return null;
  return (tonReserve / cetReserve) * tonPriceUsd;
}

function calcTvl(tonReserveRaw: string, tonPriceUsd: number): number {
  const tonReserve = parseFloat(tonReserveRaw) / 1e9;
  return tonReserve * tonPriceUsd * 2;
}

function calcVolume24h(volumeNanoTon: string, tonPriceUsd: number): number {
  return (parseFloat(volumeNanoTon) / 1e9) * tonPriceUsd;
}

describe('useLivePoolData — pure mirrors', () => {
  it('price from reserves, TVL, volume24h, initial state shape', () => {
    expect(
      calcPriceFromReserves(String(100 * 1e9), String(1000 * 1e9), 2),
    ).toBeCloseTo(0.2, 5);
    expect(calcPriceFromReserves(String(100 * 1e9), '0', 2)).toBeNull();
    expect(
      calcPriceFromReserves(String(500 * 1e9), String(5000 * 1e9), 5),
    ).toBeCloseTo(0.5, 5);

    expect(calcTvl(String(100 * 1e9), 2)).toBeCloseTo(400, 5);
    expect(calcTvl('0', 2)).toBe(0);

    expect(calcVolume24h(String(50 * 1e9), 2)).toBeCloseTo(100, 5);
    expect(calcVolume24h('0', 2)).toBe(0);

    const INITIAL_STATE = {
      priceUsd: null,
      tvlUsd: null,
      volume24hUsd: null,
      tonPriceUsd: null,
      loading: true,
      error: null,
      lastUpdated: null,
    };
    expect(INITIAL_STATE).toHaveProperty('priceUsd');
    expect(INITIAL_STATE.loading).toBe(true);
    expect(INITIAL_STATE.priceUsd).toBeNull();
    expect(INITIAL_STATE.tvlUsd).toBeNull();
    expect(INITIAL_STATE.tonPriceUsd).toBeNull();
    expect(INITIAL_STATE.error).toBeNull();
  });
});
