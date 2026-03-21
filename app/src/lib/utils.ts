import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ---------------------------------------------------------------------------
// Number & currency formatting
// ---------------------------------------------------------------------------

/**
 * Format a value as a compact USD string.
 *
 * - Values ≥ 1 000 000 → "$X.XXM"
 * - Values ≥ 1 000     → "$X.XXK"
 * - Otherwise          → "$X.XXXX"
 * - null / non-finite  → "—"
 *
 * @example
 * formatUsd(1_234_567) // "$1.23M"
 * formatUsd(5_678)     // "$5.68K"
 * formatUsd(0.0042)    // "$0.0042"
 * formatUsd(null)      // "—"
 */
export function formatUsd(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—"
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
  return `$${value.toFixed(4)}`
}

/**
 * Format a token price as a USD string.
 *
 * Very small values (< 0.001) are shown in exponential notation to avoid
 * a long string of leading zeros.
 *
 * @example
 * formatPrice(0.00042)  // "$4.20e-4"
 * formatPrice(3.1415)   // "$3.1415"
 * formatPrice(null)     // "—"
 */
export function formatPrice(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—"
  if (value < 0.001) return `$${value.toExponential(2)}`
  return `$${value.toFixed(4)}`
}

/**
 * Clamp a number between a minimum and maximum value.
 *
 * @example
 * clamp(5, 0, 10)  // 5
 * clamp(-3, 0, 10) // 0
 * clamp(15, 0, 10) // 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Returns a debounced version of `fn` that delays invoking it until after
 * `delay` milliseconds have elapsed since the last call.
 *
 * @example
 * const debouncedSearch = debounce((q: string) => search(q), 300);
 * input.addEventListener('input', e => debouncedSearch(e.target.value));
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
