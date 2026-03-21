import { describe, it, expect } from 'vitest';
import translations, { type LangCode } from '../i18n/translations';
import { SUPPORTED_LANGS } from '../hooks/useLanguage';

/**
 * Translations completeness tests
 *
 * Ensures that every supported language has all required i18n keys
 * and that no translation string is accidentally left empty.
 */

describe('SUPPORTED_LANGS', () => {
  it('contains exactly the expected language codes', () => {
    expect(SUPPORTED_LANGS).toEqual(['en', 'es', 'zh', 'ru', 'ro']);
  });

  it('has no duplicate entries', () => {
    const unique = new Set(SUPPORTED_LANGS);
    expect(unique.size).toBe(SUPPORTED_LANGS.length);
  });
});

describe('translations — completeness', () => {
  // Derive the expected key paths from the English (canonical) translation
  const enKeys = {
    nav: Object.keys(translations.en.nav),
    hero: Object.keys(translations.en.hero),
    tokenomics: Object.keys(translations.en.tokenomics),
  };

  // Verify every language listed in SUPPORTED_LANGS has a translation entry
  it('has an entry for every supported language', () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(translations).toHaveProperty(lang);
    }
  });

  for (const lang of SUPPORTED_LANGS as LangCode[]) {
    describe(`language: ${lang}`, () => {
      it('has all nav keys', () => {
        for (const key of enKeys.nav) {
          expect(translations[lang].nav).toHaveProperty(key);
        }
      });

      it('has all hero keys', () => {
        for (const key of enKeys.hero) {
          expect(translations[lang].hero).toHaveProperty(key);
        }
      });

      it('has all tokenomics keys', () => {
        for (const key of enKeys.tokenomics) {
          expect(translations[lang].tokenomics).toHaveProperty(key);
        }
      });

      it('has no empty translation strings', () => {
        const t = translations[lang];

        for (const key of enKeys.nav) {
          expect(t.nav[key as keyof typeof t.nav]).toBeTruthy();
        }
        for (const key of enKeys.hero) {
          expect(t.hero[key as keyof typeof t.hero]).toBeTruthy();
        }
        for (const key of enKeys.tokenomics) {
          expect(t.tokenomics[key as keyof typeof t.tokenomics]).toBeTruthy();
        }
      });
    });
  }
});

describe('translations — English defaults', () => {
  it('hero tagline references Cetățuia', () => {
    expect(translations.en.hero.tagline).toContain('Cetățuia');
  });

  it('tokenomics supply key is present and non-empty', () => {
    expect(translations.en.tokenomics.supply).toBeTruthy();
  });

  it('nav has exactly 7 entries', () => {
    expect(Object.keys(translations.en.nav)).toHaveLength(7);
  });
});
