import { describe, it, expect } from "vitest";
import { cn, formatAddress, formatTokenAmount, formatCompactNumber } from "../lib/utils";

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

describe("formatAddress", () => {
  const full = "EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB";

  it("truncates a long address with default lengths", () => {
    expect(formatAddress(full)).toBe("EQB5_h…lfnB");
  });

  it("respects custom prefix and suffix lengths", () => {
    expect(formatAddress(full, 4, 4)).toBe("EQB5…lfnB");
  });

  it("returns the address unchanged when it is short enough", () => {
    expect(formatAddress("short", 6, 4)).toBe("short");
  });

  it("returns the address unchanged when it is exactly at the threshold", () => {
    expect(formatAddress("abcdefghij", 6, 4)).toBe("abcdefghij");
  });

  it("handles an empty string without throwing", () => {
    expect(formatAddress("")).toBe("");
  });
});

describe("formatTokenAmount", () => {
  it("formats a chain decimal string with 2 decimal places by default", () => {
    expect(formatTokenAmount("9000.000000000")).toBe("9,000.00");
  });

  it("formats a numeric value", () => {
    expect(formatTokenAmount(1234.5, 3)).toBe("1,234.500");
  });

  it("formats zero correctly", () => {
    expect(formatTokenAmount(0)).toBe("0.00");
  });

  it("formats a small value with default decimals", () => {
    expect(formatTokenAmount("0.5")).toBe("0.50");
  });

  it("returns '—' for NaN or non-finite values", () => {
    expect(formatTokenAmount("not-a-number")).toBe("—");
    expect(formatTokenAmount(Infinity)).toBe("—");
  });
});

describe("formatCompactNumber", () => {
  it("returns units below 1000 unchanged", () => {
    expect(formatCompactNumber(999)).toBe("999");
    expect(formatCompactNumber(0)).toBe("0");
  });

  it("formats thousands with K suffix", () => {
    expect(formatCompactNumber(9000)).toBe("9K");
    expect(formatCompactNumber(1500)).toBe("1.5K");
    expect(formatCompactNumber(100000)).toBe("100K");
  });

  it("formats millions with M suffix", () => {
    expect(formatCompactNumber(1_000_000)).toBe("1M");
    expect(formatCompactNumber(2_300_000)).toBe("2.3M");
  });

  it("formats billions with B suffix", () => {
    expect(formatCompactNumber(1_500_000_000)).toBe("1.5B");
  });

  it("handles negative numbers", () => {
    expect(formatCompactNumber(-5000)).toBe("-5K");
  });

  it("returns '—' for non-finite values", () => {
    expect(formatCompactNumber(NaN)).toBe("—");
    expect(formatCompactNumber(Infinity)).toBe("—");
  });
});
