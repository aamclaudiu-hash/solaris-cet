import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Clamp a number between a minimum and maximum value.
 * @example clamp(15, 0, 10) // → 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linear interpolation between two values.
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (0–1)
 * @example lerp(0, 100, 0.5) // → 50
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Format a number as a compact USD string (e.g. $1.23K, $4.56M).
 * Returns '—' for null/undefined/non-finite values.
 * @example formatUSD(1500) // → '$1.50K'
 */
export function formatUSD(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
  return `$${value.toFixed(4)}`
}

/**
 * Format a crypto price with appropriate precision.
 * Uses scientific notation for very small positive values (0 < value < 0.001).
 * Returns '—' for null/undefined/non-finite values.
 * @example formatCryptoPrice(0.00042) // → '$4.20e-4'
 */
export function formatCryptoPrice(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'
  if (value !== 0 && Math.abs(value) < 0.001) return `$${value.toExponential(2)}`
  return `$${value.toFixed(4)}`
}
