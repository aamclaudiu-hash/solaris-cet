/**
 * Tailwind classes for the CET AI query length indicator (hero + modal).
 * Amber when within 200 characters of the cap (aligned with UX in `CetAiSearch`).
 */
export function cetAiQueryCharCountToneClass(length: number, max: number): string {
  return length >= max - 200 ? 'text-amber-400/90' : 'text-gray-600';
}
