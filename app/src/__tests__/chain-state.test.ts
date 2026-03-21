import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ChainState } from '../lib/chain-state';

const MOCK_CHAIN_STATE: ChainState = {
  token: {
    symbol: 'CET',
    name: 'Solaris CET',
    contract: 'EQBbUfeIo6yrNRButZGdf4WRJZZ3IDkN8kHJbsKlu3xxypWX',
    totalSupply: '9000.000000000',
    decimals: 9,
  },
  pool: {
    address: 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB',
    reserveTon: '1000.0',
    reserveCet: '500.0',
    lpSupply: '700.0',
    priceTonPerCet: '2.0',
  },
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('ChainState type shape', () => {
  it('token has required fields', () => {
    const token = MOCK_CHAIN_STATE.token;
    expect(token.symbol).toBe('CET');
    expect(token.name).toBe('Solaris CET');
    expect(token.decimals).toBe(9);
    expect(token.contract).toBeTruthy();
  });

  it('pool has required fields', () => {
    const pool = MOCK_CHAIN_STATE.pool;
    expect(pool.address).toBeTruthy();
    expect(pool.reserveTon).not.toBeNull();
    expect(pool.reserveCet).not.toBeNull();
    expect(pool.priceTonPerCet).not.toBeNull();
  });

  it('totalSupply reflects 9,000 CET supply', () => {
    expect(MOCK_CHAIN_STATE.token.totalSupply).toBe('9000.000000000');
  });

  it('pool address matches known DeDust pool', () => {
    expect(MOCK_CHAIN_STATE.pool.address).toBe(
      'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB'
    );
  });

  it('allows null for unknown pool fields', () => {
    const partial: ChainState = {
      ...MOCK_CHAIN_STATE,
      pool: {
        ...MOCK_CHAIN_STATE.pool,
        reserveTon: null,
        reserveCet: null,
        lpSupply: null,
        priceTonPerCet: null,
      },
    };
    expect(partial.pool.reserveTon).toBeNull();
    expect(partial.pool.priceTonPerCet).toBeNull();
  });

  it('updatedAt is a valid ISO string', () => {
    const date = new Date(MOCK_CHAIN_STATE.updatedAt);
    expect(isNaN(date.getTime())).toBe(false);
  });
});

describe('fetchChainState via mocked fetch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('resolves with a ChainState-shaped object on successful fetch', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_CHAIN_STATE,
    });

    // Re-import the module so the mocked fetch is used for the module-level promise
    const { chainStatePromise } = await import('../lib/chain-state');
    const result = await chainStatePromise;

    expect(result.token.symbol).toBe('CET');
    expect(result.pool.address).toBe('EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB');
  });
});
