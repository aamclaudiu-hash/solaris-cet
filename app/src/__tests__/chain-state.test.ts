import { describe, it, expect } from 'vitest';
import type { ChainState, ChainTokenState, ChainPoolState } from '../lib/chain-state';

/**
 * Type-level and shape tests for chain-state data structures.
 *
 * These tests validate that:
 * - All required fields are present in valid chain state objects
 * - Nullable fields accept both a string value and null
 * - Consumer code can safely read every field without runtime errors
 */

describe('ChainTokenState', () => {
  it('accepts a fully-populated token state object', () => {
    const token: ChainTokenState = {
      symbol: 'CET',
      name: 'Solaris CET',
      contract: 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB',
      totalSupply: '9000.000000000',
      decimals: 9,
    };
    expect(token.symbol).toBe('CET');
    expect(token.name).toBe('Solaris CET');
    expect(token.totalSupply).toBe('9000.000000000');
    expect(token.decimals).toBe(9);
  });

  it('allows totalSupply to be null (unknown on-chain state)', () => {
    const token: ChainTokenState = {
      symbol: 'CET',
      name: 'Solaris CET',
      contract: 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB',
      totalSupply: null,
      decimals: 9,
    };
    expect(token.totalSupply).toBeNull();
  });
});

describe('ChainPoolState', () => {
  it('accepts a fully-populated pool state object', () => {
    const pool: ChainPoolState = {
      address: 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB',
      reserveTon: '5000.0',
      reserveCet: '1000.0',
      lpSupply: '2236.0',
      priceTonPerCet: '5.0',
    };
    expect(pool.address).toBeTruthy();
    expect(pool.reserveTon).toBe('5000.0');
    expect(pool.priceTonPerCet).toBe('5.0');
  });

  it('allows all optional numeric fields to be null', () => {
    const pool: ChainPoolState = {
      address: 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB',
      reserveTon: null,
      reserveCet: null,
      lpSupply: null,
      priceTonPerCet: null,
    };
    expect(pool.reserveTon).toBeNull();
    expect(pool.reserveCet).toBeNull();
    expect(pool.lpSupply).toBeNull();
    expect(pool.priceTonPerCet).toBeNull();
  });
});

describe('ChainState', () => {
  it('accepts a valid full chain state object', () => {
    const state: ChainState = {
      token: {
        symbol: 'CET',
        name: 'Solaris CET',
        contract: 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB',
        totalSupply: '9000.000000000',
        decimals: 9,
      },
      pool: {
        address: 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB',
        reserveTon: '5000.0',
        reserveCet: '1000.0',
        lpSupply: '2236.0',
        priceTonPerCet: '5.0',
      },
      updatedAt: '2025-01-01T00:00:00.000Z',
    };

    expect(state.token.symbol).toBe('CET');
    expect(state.pool.address).toBeTruthy();
    expect(state.updatedAt).toBeTruthy();
  });

  it('updatedAt is stored as an ISO 8601 string', () => {
    const isoTimestamp = '2025-06-15T12:30:00.000Z';
    const state: ChainState = {
      token: {
        symbol: 'CET',
        name: 'Solaris CET',
        contract: 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB',
        totalSupply: '9000.000000000',
        decimals: 9,
      },
      pool: {
        address: 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB',
        reserveTon: null,
        reserveCet: null,
        lpSupply: null,
        priceTonPerCet: null,
      },
      updatedAt: isoTimestamp,
    };

    // Verify the timestamp is a valid ISO 8601 date
    const parsed = new Date(state.updatedAt);
    expect(parsed.toISOString()).toBe(isoTimestamp);
  });

  it('priceTonPerCet can be parsed as a float when not null', () => {
    const pool: ChainPoolState = {
      address: 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB',
      reserveTon: '5000.0',
      reserveCet: '1000.0',
      lpSupply: '2236.0',
      priceTonPerCet: '5.123456789',
    };
    const price = pool.priceTonPerCet !== null ? parseFloat(pool.priceTonPerCet) : null;
    expect(price).toBeCloseTo(5.123456789, 6);
  });
});
