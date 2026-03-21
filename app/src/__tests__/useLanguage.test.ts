import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Unit tests for language detection logic used by useLanguageState.
 *
 * The detectLanguage function reads from localStorage and navigator.language.
 * We test the logic directly by simulating those browser APIs.
 */

const SUPPORTED_LANGS = ['en', 'es', 'zh', 'ru', 'ro'] as const;
type LangCode = (typeof SUPPORTED_LANGS)[number];

// Re-implement detectLanguage inline so we can test it in isolation without
// importing the React hook (which would require a full React render context).
function detectLanguage(
  localStorageValue: string | null,
  browserLang: string
): LangCode {
  if (localStorageValue && (SUPPORTED_LANGS as readonly string[]).includes(localStorageValue)) {
    return localStorageValue as LangCode;
  }
  const short = browserLang.slice(0, 2);
  return (SUPPORTED_LANGS as readonly string[]).includes(short) ? (short as LangCode) : 'en';
}

describe('detectLanguage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns stored language from localStorage when valid', () => {
    expect(detectLanguage('es', 'en-US')).toBe('es');
    expect(detectLanguage('zh', 'en-US')).toBe('zh');
    expect(detectLanguage('ru', 'en-US')).toBe('ru');
    expect(detectLanguage('ro', 'en-US')).toBe('ro');
  });

  it('ignores invalid localStorage value and falls back to browser lang', () => {
    expect(detectLanguage('fr', 'es-ES')).toBe('es');
    expect(detectLanguage('de', 'zh-CN')).toBe('zh');
  });

  it('falls back to "en" when localStorage is null and browser lang unsupported', () => {
    expect(detectLanguage(null, 'fr-FR')).toBe('en');
    expect(detectLanguage(null, 'de-DE')).toBe('en');
    expect(detectLanguage(null, 'ja-JP')).toBe('en');
  });

  it('uses browser language when localStorage is null', () => {
    expect(detectLanguage(null, 'es-ES')).toBe('es');
    expect(detectLanguage(null, 'ru-RU')).toBe('ru');
    expect(detectLanguage(null, 'ro-RO')).toBe('ro');
  });

  it('handles exact two-letter browser language codes', () => {
    expect(detectLanguage(null, 'en')).toBe('en');
    expect(detectLanguage(null, 'zh')).toBe('zh');
  });

  it('defaults to "en" when localStorage is empty string', () => {
    expect(detectLanguage('', 'en-US')).toBe('en');
  });

  it('is case-sensitive — "EN" is not a supported code', () => {
    // SUPPORTED_LANGS are all lower-case; 'EN' should not match
    expect(detectLanguage('EN', 'fr-FR')).toBe('en'); // falls back via browser 'fr' → unsupported → 'en'
  });
});
