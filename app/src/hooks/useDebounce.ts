import { useEffect, useRef, useState } from 'react';

/**
 * useDebounce — delays updating the returned value until `delay` ms have
 * elapsed without `value` changing.  Useful for search inputs and live-filter
 * scenarios where you want to avoid firing expensive operations on every key
 * stroke.
 *
 * @param value - The value to debounce.
 * @param delay - Debounce delay in milliseconds (default: 300).
 * @returns The debounced value, which lags behind `value` by up to `delay` ms.
 *
 * @example
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 400);
 * useEffect(() => { fetchResults(debouncedQuery); }, [debouncedQuery]);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
