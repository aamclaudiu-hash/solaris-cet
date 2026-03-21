import { describe, it, expect } from 'vitest';
import translations, { type LangCode, type Translations } from '../i18n/translations';
import { SUPPORTED_LANGS } from '../hooks/useLanguage';

// All expected top-level keys in the Translations interface
const TOP_LEVEL_KEYS: (keyof Translations)[] = ['nav', 'hero', 'tokenomics'];

// Expected sub-keys for each section
const NAV_KEYS: (keyof Translations['nav'])[] = [
  'home',
  'cetApp',
  'tokenomics',
  'roadmap',
  'howToBuy',
  'whitepaper',
  'resources',
];
const HERO_KEYS: (keyof Translations['hero'])[] = ['tagline', 'subtitle', 'buyNow', 'learnMore'];
const TOKENOMICS_KEYS: (keyof Translations['tokenomics'])[] = [
  'title',
  'supply',
  'poolAddress',
];

describe('translations', () => {
  it('exports the correct supported language codes', () => {
    const expectedCodes: LangCode[] = ['en', 'es', 'zh', 'ru', 'ro'];
    expect(SUPPORTED_LANGS).toEqual(expectedCodes);
  });

  it('has an entry for every supported language', () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(translations).toHaveProperty(lang);
    }
  });

  it('every language has all top-level sections', () => {
    for (const lang of SUPPORTED_LANGS) {
      for (const key of TOP_LEVEL_KEYS) {
        expect(translations[lang]).toHaveProperty(key);
      }
    }
  });

  it('every language has all nav keys', () => {
    for (const lang of SUPPORTED_LANGS) {
      for (const key of NAV_KEYS) {
        expect(translations[lang].nav).toHaveProperty(key);
      }
    }
  });

  it('every language has all hero keys', () => {
    for (const lang of SUPPORTED_LANGS) {
      for (const key of HERO_KEYS) {
        expect(translations[lang].hero).toHaveProperty(key);
      }
    }
  });

  it('every language has all tokenomics keys', () => {
    for (const lang of SUPPORTED_LANGS) {
      for (const key of TOKENOMICS_KEYS) {
        expect(translations[lang].tokenomics).toHaveProperty(key);
      }
    }
  });

  it('no translation string is empty', () => {
    for (const lang of SUPPORTED_LANGS) {
      const t = translations[lang];

      for (const key of NAV_KEYS) {
        expect(t.nav[key], `${lang}.nav.${key}`).not.toBe('');
      }
      for (const key of HERO_KEYS) {
        expect(t.hero[key], `${lang}.hero.${key}`).not.toBe('');
      }
      for (const key of TOKENOMICS_KEYS) {
        expect(t.tokenomics[key], `${lang}.tokenomics.${key}`).not.toBe('');
      }
    }
  });

  it('every language nav is symmetric with English nav', () => {
    const enNavKeys = Object.keys(translations.en.nav).sort();
    for (const lang of SUPPORTED_LANGS) {
      expect(Object.keys(translations[lang].nav).sort()).toEqual(enNavKeys);
    }
  });

  it('every language hero is symmetric with English hero', () => {
    const enHeroKeys = Object.keys(translations.en.hero).sort();
    for (const lang of SUPPORTED_LANGS) {
      expect(Object.keys(translations[lang].hero).sort()).toEqual(enHeroKeys);
    }
  });

  it('every language tokenomics is symmetric with English tokenomics', () => {
    const enTokenomicsKeys = Object.keys(translations.en.tokenomics).sort();
    for (const lang of SUPPORTED_LANGS) {
      expect(Object.keys(translations[lang].tokenomics).sort()).toEqual(enTokenomicsKeys);
    }
  });

  it('English is the fallback language and is fully populated', () => {
    const en = translations.en;
    expect(en.nav.home).toBe('Home');
    expect(en.hero.buyNow).toBe('Buy CET');
    expect(en.tokenomics.title).toBe('Tokenomics');
  });

  it('no language reuses English strings verbatim in non-English entries (spot check)', () => {
    // Spanish "Home" should not be the English "Home"
    expect(translations.es.nav.home).not.toBe(translations.en.nav.home);
    // Chinese "Home" should not be the English "Home"
    expect(translations.zh.nav.home).not.toBe(translations.en.nav.home);
    // Romanian "Home" should not be the English "Home"
    expect(translations.ro.nav.home).not.toBe(translations.en.nav.home);
  });
});
