import { describe, it, expect } from 'vitest';
import translations, { type LangCode } from '../i18n/translations';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Recursively collect every leaf key as a dot-notation path. */
function getLeafPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return getLeafPaths(value as Record<string, unknown>, path);
    }
    return [path];
  });
}

// ── Constants ─────────────────────────────────────────────────────────────────

const LANG_CODES = Object.keys(translations) as LangCode[];
const BASE_PATHS = getLeafPaths(translations.en as unknown as Record<string, unknown>);

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('i18n translations', () => {
  it('exports translations for all 5 supported languages', () => {
    expect(LANG_CODES.sort()).toEqual(['en', 'es', 'ro', 'ru', 'zh']);
  });

  it.each(LANG_CODES)(
    'language "%s" contains every key present in the English baseline',
    (lang) => {
      const langPaths = getLeafPaths(translations[lang] as unknown as Record<string, unknown>);
      expect(langPaths.sort()).toEqual(BASE_PATHS.sort());
    }
  );

  it.each(LANG_CODES)(
    'language "%s" has no empty string values',
    (lang) => {
      function checkNonEmpty(obj: Record<string, unknown>, path: string): void {
        for (const [key, value] of Object.entries(obj)) {
          const fullPath = path ? `${path}.${key}` : key;
          if (typeof value === 'string') {
            expect(value, `${lang}.${fullPath} must not be empty`).not.toBe('');
          } else if (typeof value === 'object' && value !== null) {
            checkNonEmpty(value as Record<string, unknown>, fullPath);
          }
        }
      }
      checkNonEmpty(translations[lang] as unknown as Record<string, unknown>, '');
    }
  );
});
