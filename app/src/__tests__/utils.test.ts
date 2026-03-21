import { describe, it, expect } from "vitest";
import { cn, formatAddress, formatCompactNumber, debounce } from "../lib/utils";

// ── cn (class name utility) ──────────────────────────────────────────────────

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

// ── formatAddress ────────────────────────────────────────────────────────────

describe("formatAddress", () => {
  const longAddress = "EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB";

  it("truncates a long address with defaults (prefix=6, suffix=4)", () => {
    expect(formatAddress(longAddress)).toBe("EQB5_h…lfnB");
  });

  it("uses custom prefix and suffix lengths", () => {
    expect(formatAddress(longAddress, 4, 6)).toBe("EQB5…IelfnB");
  });

  it("returns the address unchanged when it is short enough to fit", () => {
    const short = "EQB5lfnB";
    // 8 chars ≤ 6 + 4 + 1 = 11 → no truncation needed
    expect(formatAddress(short)).toBe(short);
  });

  it("returns the address unchanged when prefix + suffix cover the whole string", () => {
    const exact = "EQB5_lfnB"; // 9 chars, prefix=6 suffix=4 → 6+4+1=11 > 9 → keep
    expect(formatAddress(exact)).toBe(exact);
  });

  it("handles an empty string gracefully", () => {
    expect(formatAddress("")).toBe("");
  });
});

// ── formatCompactNumber ──────────────────────────────────────────────────────

describe("formatCompactNumber", () => {
  it("formats numbers below 1,000 with locale separators", () => {
    expect(formatCompactNumber(500)).toBe("500");
  });

  it("formats numbers in the thousands range with K suffix", () => {
    expect(formatCompactNumber(1500)).toBe("1.5K");
  });

  it("formats numbers in the millions range with M suffix", () => {
    expect(formatCompactNumber(1_500_000)).toBe("1.5M");
  });

  it("formats numbers in the billions range with B suffix", () => {
    expect(formatCompactNumber(2_400_000_000)).toBe("2.4B");
  });

  it("respects custom decimals parameter", () => {
    expect(formatCompactNumber(1_234_567, 1)).toBe("1.2M");
  });

  it("handles zero", () => {
    expect(formatCompactNumber(0)).toBe("0");
  });

  it("handles negative numbers", () => {
    expect(formatCompactNumber(-2_000_000)).toBe("-2M");
  });

  it("trims unnecessary trailing zeros from compact suffix", () => {
    // 2,000,000 → "2M" not "2.00M"
    expect(formatCompactNumber(2_000_000)).toBe("2M");
  });
});

// ── debounce ─────────────────────────────────────────────────────────────────

describe("debounce", () => {
  it("delays the function call by the specified time", async () => {
    let callCount = 0;
    const debounced = debounce(() => { callCount++; }, 50);

    debounced();
    expect(callCount).toBe(0); // not called yet

    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(callCount).toBe(1); // called once after delay
  });

  it("cancels pending calls when invoked again before the delay", async () => {
    let callCount = 0;
    const debounced = debounce(() => { callCount++; }, 50);

    debounced();
    debounced();
    debounced();

    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(callCount).toBe(1); // called only once despite 3 rapid calls
  });

  it("passes arguments to the wrapped function", async () => {
    let received: string | undefined;
    const debounced = debounce((s: string) => { received = s; }, 50);

    debounced("hello");
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(received).toBe("hello");
  });
});
