import { describe, it, expect } from "vitest";
import { cn, clamp, lerp, formatUSD, formatCryptoPrice } from "../lib/utils";

describe("cn (class name utility)", () => {
  it("returns an empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("merges a single class string unchanged", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("omits falsy values (false, null, undefined, 0, empty string)", () => {
    expect(cn("foo", false, null, undefined, 0, "", "bar")).toBe("foo bar");
  });

  it("resolves Tailwind conflicts — later class wins", () => {
    // tailwind-merge should keep only p-4 and discard p-2
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("resolves multiple Tailwind conflicts in one call", () => {
    expect(cn("text-sm text-lg", "font-bold")).toBe("text-lg font-bold");
  });

  it("handles conditional classes via object syntax", () => {
    expect(cn({ "bg-red-500": true, "text-white": false })).toBe("bg-red-500");
  });

  it("handles arrays of class values", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });
});

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to min when value is below range", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps to max when value is above range", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("returns min when value equals min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("returns max when value equals max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("handles negative ranges", () => {
    expect(clamp(-15, -10, -5)).toBe(-10);
    expect(clamp(-3, -10, -5)).toBe(-5);
    expect(clamp(-7, -10, -5)).toBe(-7);
  });

  it("handles float values", () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
    expect(clamp(1.5, 0, 1)).toBe(1);
  });
});

describe("lerp", () => {
  it("returns a when t is 0", () => {
    expect(lerp(0, 100, 0)).toBe(0);
  });

  it("returns b when t is 1", () => {
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it("returns midpoint when t is 0.5", () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
  });

  it("works with negative values", () => {
    expect(lerp(-100, 100, 0.5)).toBe(0);
  });

  it("extrapolates beyond range when t > 1", () => {
    expect(lerp(0, 100, 2)).toBe(200);
  });
});

describe("formatUSD", () => {
  it("returns '—' for null", () => {
    expect(formatUSD(null)).toBe("—");
  });

  it("returns '—' for undefined", () => {
    expect(formatUSD(undefined)).toBe("—");
  });

  it("returns '—' for NaN", () => {
    expect(formatUSD(NaN)).toBe("—");
  });

  it("returns '—' for Infinity", () => {
    expect(formatUSD(Infinity)).toBe("—");
  });

  it("formats values below 1,000 to 4 decimal places", () => {
    expect(formatUSD(1.5678)).toBe("$1.5678");
  });

  it("formats values in the thousands as K", () => {
    expect(formatUSD(1500)).toBe("$1.50K");
  });

  it("formats values in the millions as M", () => {
    expect(formatUSD(2_500_000)).toBe("$2.50M");
  });

  it("formats exactly 1,000 as K", () => {
    expect(formatUSD(1000)).toBe("$1.00K");
  });

  it("formats exactly 1,000,000 as M", () => {
    expect(formatUSD(1_000_000)).toBe("$1.00M");
  });

  it("formats zero as four decimal places", () => {
    expect(formatUSD(0)).toBe("$0.0000");
  });
});

describe("formatCryptoPrice", () => {
  it("returns '—' for null", () => {
    expect(formatCryptoPrice(null)).toBe("—");
  });

  it("returns '—' for undefined", () => {
    expect(formatCryptoPrice(undefined)).toBe("—");
  });

  it("returns '—' for NaN", () => {
    expect(formatCryptoPrice(NaN)).toBe("—");
  });

  it("uses scientific notation for very small values (< 0.001)", () => {
    const result = formatCryptoPrice(0.00042);
    expect(result).toMatch(/^\$\d+\.?\d*e[-+]\d+$/);
  });

  it("formats normal prices to 4 decimal places", () => {
    expect(formatCryptoPrice(1.2345)).toBe("$1.2345");
  });

  it("formats exactly 0.001 to 4 decimal places (not scientific)", () => {
    expect(formatCryptoPrice(0.001)).toBe("$0.0010");
  });

  it("formats zero as four decimal places (not scientific)", () => {
    expect(formatCryptoPrice(0)).toBe("$0.0000");
  });
});
