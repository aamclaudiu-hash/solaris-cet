import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Truncates a long blockchain address to a shorter display form.
 *
 * @example
 * formatAddress('EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB')
 * // → 'EQB5_h…lfnB'
 *
 * @param address   Full address string.
 * @param prefixLen Characters to keep at the start (default 6).
 * @param suffixLen Characters to keep at the end   (default 4).
 */
export function formatAddress(
  address: string,
  prefixLen = 6,
  suffixLen = 4
): string {
  if (address.length <= prefixLen + suffixLen + 1) return address;
  return `${address.slice(0, prefixLen)}…${address.slice(-suffixLen)}`;
}

/**
 * Formats a number with locale-aware thousands separators and an optional
 * compact suffix (K / M / B) for very large values.
 *
 * @example
 * formatCompactNumber(9000)        // → '9,000'
 * formatCompactNumber(1_500_000)   // → '1.5M'
 * formatCompactNumber(2_400, 1)    // → '2.4K'
 *
 * @param value    The number to format.
 * @param decimals Maximum fraction digits for compact suffixes (default 2).
 */
export function formatCompactNumber(value: number, decimals = 2): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    return `${sign}${+(abs / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${+(abs / 1_000_000).toFixed(decimals)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}${+(abs / 1_000).toFixed(decimals)}K`;
  }
  return value.toLocaleString('en-US');
}

/**
 * Returns a debounced version of `fn` that delays invocation until `delay` ms
 * have elapsed since the last call. Useful for limiting expensive operations
 * triggered by rapid user input (e.g. search, resize).
 *
 * @example
 * const debouncedSearch = debounce((query: string) => search(query), 300);
 * input.addEventListener('input', (e) => debouncedSearch(e.target.value));
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
