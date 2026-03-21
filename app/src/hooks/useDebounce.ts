import { useEffect, useState } from 'react';

/**
 * useDebounce — delays updating the returned value until after `delay` ms
 * have elapsed since the last change to `value`.
 *
 * Useful for deferring expensive operations (API calls, heavy filtering) that
 * are triggered by fast-changing inputs such as search fields or sliders.
 *
 * @param value - The value to debounce.
 * @param delay - Debounce delay in milliseconds (default: 300).
 * @returns The debounced value, which lags behind `value` by at most `delay` ms.
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 400);
 *
 * useEffect(() => {
 *   if (debouncedQuery) fetchResults(debouncedQuery);
 * }, [debouncedQuery]);
 * ```
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
