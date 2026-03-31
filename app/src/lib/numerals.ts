import type { LangCode } from "@/i18n/translations"

const localeByLang: Record<LangCode, string> = {
  en: "en-US",
  es: "es-ES",
  zh: "zh-CN",
  ru: "ru-RU",
  ro: "ro-RO",
  pt: "pt-PT",
  de: "de-DE",
}

/**
 * Locale-aware integer formatting for CET supply and similar figures.
 * Uses `Intl.NumberFormat` (no extra font files; respects numeral system per locale).
 */
export function formatCetInteger(amount: number, lang: LangCode): string {
  const locale = localeByLang[lang] ?? "en-US"
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount)
}

/** Display string for fixed 9,000 CET supply in the active UI locale. */
export function formatCetSupplyWithSuffix(lang: LangCode): string {
  return `${formatCetInteger(9000, lang)} CET`
}
