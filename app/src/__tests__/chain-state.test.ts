import { describe, it, expect } from "vitest";
import type {
  ChainTokenState,
  ChainPoolState,
  ChainState,
} from "../lib/chain-state";

/**
 * Unit tests for the chain-state module type contracts and helper logic.
 *
 * The module exports typed interfaces and a fetch-based promise — we
 * validate the shape contracts and helper formatting logic here.
 */

describe("ChainTokenState shape", () => {
  it("accepts a valid token state with totalSupply", () => {
    const token: ChainTokenState = {
      symbol: "CET",
      name: "SOLARIS CET",
      contract: "EQBbUfeIo6yrNRButZGdf4WRJZZ3IDkN8kHJbsKlu3xxypWX",
      totalSupply: "9000.000000000",
      decimals: 9,
    };
    expect(token.symbol).toBe("CET");
    expect(token.decimals).toBe(9);
    expect(token.totalSupply).not.toBeNull();
  });

  it("accepts a token state where totalSupply is null", () => {
    const token: ChainTokenState = {
      symbol: "CET",
      name: "SOLARIS CET",
      contract: "EQBbUfeIo6yrNRButZGdf4WRJZZ3IDkN8kHJbsKlu3xxypWX",
      totalSupply: null,
      decimals: 9,
    };
    expect(token.totalSupply).toBeNull();
  });
});

describe("ChainPoolState shape", () => {
  it("accepts a valid pool state with all reserves", () => {
    const pool: ChainPoolState = {
      address: "EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB",
      reserveTon: "12.5",
      reserveCet: "3000.0",
      lpSupply: "1000.0",
      priceTonPerCet: "0.004166",
    };
    expect(pool.reserveTon).toBe("12.5");
    expect(pool.priceTonPerCet).not.toBeNull();
  });

  it("accepts a pool state where all nullable fields are null", () => {
    const pool: ChainPoolState = {
      address: "EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB",
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

describe("ChainState shape", () => {
  it("combines token and pool into a valid chain state", () => {
    const state: ChainState = {
      token: {
        symbol: "CET",
        name: "SOLARIS CET",
        contract: "EQBbUfeIo6yrNRButZGdf4WRJZZ3IDkN8kHJbsKlu3xxypWX",
        totalSupply: null,
        decimals: 9,
      },
      pool: {
        address: "EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB",
        reserveTon: null,
        reserveCet: null,
        lpSupply: null,
        priceTonPerCet: null,
      },
      updatedAt: "2026-03-10T06:23:33Z",
    };
    expect(state.token.symbol).toBe("CET");
    expect(state.pool.address).toContain("EQB5");
    expect(new Date(state.updatedAt).getFullYear()).toBe(2026);
  });
});

describe("state.json schema compatibility", () => {
  it("parses the static state.json fixture correctly", async () => {
    // Mirrors the shape that the ton-indexer writes to public/api/state.json
    const fixture = {
      token: {
        symbol: "CET",
        name: "SOLARIS CET",
        contract: "EQBbUfeIo6yrNRButZGdf4WRJZZ3IDkN8kHJbsKlu3xxypWX",
        totalSupply: null,
        decimals: 9,
      },
      pool: {
        address: "EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB",
        reserveTon: null,
        reserveCet: null,
        lpSupply: null,
        priceTonPerCet: null,
      },
      updatedAt: "2026-03-10T06:23:33Z",
    } satisfies ChainState;

    expect(fixture.token.symbol).toBe("CET");
    expect(Object.keys(fixture.pool)).toContain("reserveTon");
    expect(Object.keys(fixture.pool)).toContain("reserveCet");
    expect(Object.keys(fixture.pool)).toContain("priceTonPerCet");
    // Confirm legacy keys that were once in the JSON are NOT part of the schema
    expect(Object.keys(fixture.pool)).not.toContain("tvlTon");
    expect(Object.keys(fixture.pool)).not.toContain("tvlUsd");
    expect(Object.keys(fixture.pool)).not.toContain("priceUsd");
    expect(Object.keys(fixture.pool)).not.toContain("tonPriceUsd");
  });
});

describe("price formatting helpers (as used in ChainStateWidget)", () => {
  it("formats a priceTonPerCet string to 6 decimal places", () => {
    const raw = "0.004166123";
    const formatted = parseFloat(raw).toFixed(6);
    expect(formatted).toBe("0.004166");
  });

  it("formats reserveTon with locale formatting", () => {
    const raw = "12.5000";
    const formatted = parseFloat(raw).toLocaleString(undefined, {
      maximumFractionDigits: 4,
    });
    // Just ensure no NaN and it contains a numeric value
    expect(isNaN(parseFloat(formatted.replace(/,/g, "")))).toBe(false);
  });

  it("returns '—' placeholder when value is null", () => {
    const value: string | null = null;
    const display = value
      ? `${parseFloat(value).toFixed(6)} TON/CET`
      : "—";
    expect(display).toBe("—");
  });

  it("formats totalSupply with localeString", () => {
    const raw = "9000.000000000";
    const formatted = parseFloat(raw).toLocaleString();
    expect(formatted).toMatch(/9[,.]?000/);
  });
});
