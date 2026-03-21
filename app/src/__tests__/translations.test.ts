/**
 * Unit tests for the i18n translations module.
 *
 * Verifies that:
 *  - all supported language codes produce a complete Translations object
 *  - no translation key is an empty string
 *  - every language contains the same top-level and nested keys as English
 */
import { describe, it, expect } from 'vitest';
import translations, { type LangCode } from '../i18n/translations';

const LANG_CODES: LangCode[] = ['en', 'es', 'zh', 'ru', 'ro'];

/** Collect every leaf key path from an object as dot-separated strings. */
function leafPaths(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    leafPaths(v, prefix ? `${prefix}.${k}` : k)
  );
}

describe('i18n translations', () => {
  it('exports a translation object for every supported language code', () => {
    for (const code of LANG_CODES) {
      expect(translations[code]).toBeDefined();
      expect(typeof translations[code]).toBe('object');
    }
  });

  it('every language has the same leaf keys as English', () => {
    const enPaths = leafPaths(translations.en).sort();
    for (const code of LANG_CODES) {
      const paths = leafPaths(translations[code]).sort();
      expect(paths).toEqual(enPaths);
    }
  });

  it('no translation value is an empty string', () => {
    for (const code of LANG_CODES) {
      const paths = leafPaths(translations[code]);
      for (const path of paths) {
        const parts = path.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let val: any = translations[code];
        for (const part of parts) val = val[part];
        expect(val, `${code}.${path} must not be empty`).not.toBe('');
      }
    }
  });

  it('English nav section has the expected keys', () => {
    const nav = translations.en.nav;
    const expectedKeys = ['home', 'cetApp', 'tokenomics', 'roadmap', 'howToBuy', 'whitepaper', 'resources'];
    for (const key of expectedKeys) {
      expect(nav).toHaveProperty(key);
    }
  });

  it('English hero section has buyNow and learnMore strings', () => {
    expect(translations.en.hero.buyNow).toBeTruthy();
    expect(translations.en.hero.learnMore).toBeTruthy();
  });

  it('tokenomics supply differs from poolAddress in every language', () => {
    for (const code of LANG_CODES) {
      expect(translations[code].tokenomics.supply).not.toBe(
        translations[code].tokenomics.poolAddress
      );
    }
  });
});
