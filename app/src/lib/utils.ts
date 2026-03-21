import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Truncates a blockchain address to a short prefix…suffix form.
 *
 * @param address - Full address string (e.g. TON base64url address).
 * @param prefixLen - Number of leading characters to keep (default: 6).
 * @param suffixLen - Number of trailing characters to keep (default: 4).
 * @returns Truncated address string, or the original if it is short enough.
 *
 * @example
 * formatAddress('EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB')
 * // → 'EQB5_h…lfnB'
 */
export function formatAddress(
  address: string,
  prefixLen = 6,
  suffixLen = 4,
): string {
  if (address.length <= prefixLen + suffixLen) return address;
  return `${address.slice(0, prefixLen)}…${address.slice(-suffixLen)}`;
}

/**
 * Formats a raw token amount string (as returned by the chain) into a
 * human-readable decimal string with optional decimal places.
 *
 * @param raw - Amount as a string or number (may contain more decimals than needed).
 * @param decimals - Number of decimal places to show (default: 2).
 * @returns Formatted string, e.g. "9,000.00".
 *
 * @example
 * formatTokenAmount('9000.000000000') // → '9,000.00'
 * formatTokenAmount(1234.5, 3)        // → '1,234.500'
 */
export function formatTokenAmount(
  raw: string | number,
  decimals = 2,
): string {
  const num = typeof raw === "string" ? parseFloat(raw) : raw;
  if (!isFinite(num)) return "—";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a large number into a compact human-readable string using SI suffixes.
 *
 * @param value - The number to format.
 * @returns Compact string, e.g. 1_500 → "1.5K", 2_300_000 → "2.3M".
 *
 * @example
 * formatCompactNumber(9000)      // → '9K'
 * formatCompactNumber(100000)    // → '100K'
 * formatCompactNumber(1500000)   // → '1.5M'
 */
export function formatCompactNumber(value: number): string {
  if (!isFinite(value)) return "—";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}${+(abs / 1_000_000_000).toPrecision(3)}B`;
  if (abs >= 1_000_000)     return `${sign}${+(abs / 1_000_000).toPrecision(3)}M`;
  if (abs >= 1_000)         return `${sign}${+(abs / 1_000).toPrecision(3)}K`;
  return `${sign}${abs}`;
}
