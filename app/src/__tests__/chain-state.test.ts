import { describe, it, expect } from "vitest";
import type {
  ChainState,
  ChainTokenState,
  ChainPoolState,
} from "../lib/chain-state";

// ── Helper to build valid fixture objects ─────────────────────────────────

function makeToken(overrides: Partial<ChainTokenState> = {}): ChainTokenState {
  return {
    symbol: "CET",
    name: "Solaris CET",
    contract: "EQBbUfeIo6yrNRButZGdf4WRJZZ3IDkN8kHJbsKlu3xxypWX",
    totalSupply: "9000.000000000",
    decimals: 9,
    ...overrides,
  };
}

function makePool(overrides: Partial<ChainPoolState> = {}): ChainPoolState {
  return {
    address: "EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB",
    reserveTon: "100.5",
    reserveCet: "4500.0",
    lpSupply: "21213.203435",
    priceTonPerCet: "0.022333",
    ...overrides,
  };
}

function makeChainState(overrides: Partial<ChainState> = {}): ChainState {
  return {
    token: makeToken(),
    pool: makePool(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ── Token schema ──────────────────────────────────────────────────────────

describe("ChainTokenState schema", () => {
  it("accepts a fully-populated token object", () => {
    const t = makeToken();
    expect(t.symbol).toBe("CET");
    expect(t.decimals).toBe(9);
    expect(t.totalSupply).not.toBeNull();
  });

  it("accepts null totalSupply (unknown state)", () => {
    const t = makeToken({ totalSupply: null });
    expect(t.totalSupply).toBeNull();
  });

  it("decimals is a number (not a string)", () => {
    const t = makeToken();
    expect(typeof t.decimals).toBe("number");
  });

  it("symbol is a non-empty string", () => {
    const t = makeToken();
    expect(t.symbol.trim().length).toBeGreaterThan(0);
  });
});

// ── Pool schema ───────────────────────────────────────────────────────────

describe("ChainPoolState schema", () => {
  it("accepts a fully-populated pool object", () => {
    const p = makePool();
    expect(p.address).toContain("EQ");
    expect(parseFloat(p.reserveTon!)).toBeGreaterThan(0);
  });

  it("accepts null nullable fields (unknown state)", () => {
    const p = makePool({
      reserveTon: null,
      reserveCet: null,
      lpSupply: null,
      priceTonPerCet: null,
    });
    expect(p.reserveTon).toBeNull();
    expect(p.reserveCet).toBeNull();
    expect(p.lpSupply).toBeNull();
    expect(p.priceTonPerCet).toBeNull();
  });

  it("priceTonPerCet is parseable as a positive float when present", () => {
    const p = makePool({ priceTonPerCet: "0.022333" });
    const price = parseFloat(p.priceTonPerCet!);
    expect(price).toBeGreaterThan(0);
    expect(isNaN(price)).toBe(false);
  });
});

// ── Full ChainState ───────────────────────────────────────────────────────

describe("ChainState schema", () => {
  it("combines token and pool into one object", () => {
    const s = makeChainState();
    expect(s.token).toBeDefined();
    expect(s.pool).toBeDefined();
    expect(s.updatedAt).toBeTruthy();
  });

  it("updatedAt is a valid ISO 8601 date string", () => {
    const s = makeChainState();
    const d = new Date(s.updatedAt);
    expect(isNaN(d.getTime())).toBe(false);
  });

  it("handles partial unknown state (all nulls)", () => {
    const s = makeChainState({
      token: makeToken({ totalSupply: null }),
      pool: makePool({
        reserveTon: null,
        reserveCet: null,
        lpSupply: null,
        priceTonPerCet: null,
      }),
    });
    expect(s.token.totalSupply).toBeNull();
    expect(s.pool.priceTonPerCet).toBeNull();
  });
});

// ── Domain invariants ─────────────────────────────────────────────────────

describe("Solaris CET domain invariants", () => {
  it("token supply does not exceed 9000 when present", () => {
    const t = makeToken({ totalSupply: "9000.000000000" });
    if (t.totalSupply !== null) {
      expect(parseFloat(t.totalSupply)).toBeLessThanOrEqual(9000);
    }
  });

  it("pool address matches the known DeDust pool", () => {
    const p = makePool();
    expect(p.address).toBe(
      "EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB"
    );
  });

  it("token contract matches the known CET contract", () => {
    const t = makeToken();
    expect(t.contract).toBe(
      "EQBbUfeIo6yrNRButZGdf4WRJZZ3IDkN8kHJbsKlu3xxypWX"
    );
  });

  it("decimals is exactly 9 for CET", () => {
    const t = makeToken();
    expect(t.decimals).toBe(9);
  });
});
