import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Truncates a blockchain address for display, e.g.:
 *   "EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB" → "EQB5…fnB"
 *
 * @param address - Full address string
 * @param chars   - Number of characters to keep on each side (default: 4)
 * @returns Truncated address with an ellipsis in the middle, or the original
 *          address if it is too short to truncate.
 */
export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 1) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}

/**
 * Formats a raw token amount string (as stored in `ChainState`) for display.
 *
 * - Parses the decimal string and rounds it to `decimals` places.
 * - Returns `"—"` when the input is `null` or cannot be parsed.
 *
 * @param amount   - Human-readable decimal string, e.g. "9000.000000000" or null
 * @param decimals - Number of decimal places to show (default: 2)
 */
export function formatTokenAmount(amount: string | null, decimals = 2): string {
  if (amount === null) return "—";
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a price string (TON per CET or similar) for display.
 *
 * - Uses up to 6 significant decimal places to preserve precision for
 *   small prices typical in early-stage token markets.
 * - Returns `"—"` when the input is `null` or cannot be parsed.
 *
 * @param price    - Human-readable decimal string or null
 * @param decimals - Number of decimal places to show (default: 6)
 */
export function formatPrice(price: string | null, decimals = 6): string {
  if (price === null) return "—";
  const n = Number(price);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
