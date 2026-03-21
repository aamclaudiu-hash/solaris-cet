import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SUPPORTED_LANGS } from '../hooks/useLanguage';
import translations from '../i18n/translations';
import type { LangCode } from '../i18n/translations';

describe('SUPPORTED_LANGS', () => {
  it('includes all expected language codes', () => {
    const expected: LangCode[] = ['en', 'es', 'zh', 'ru', 'ro', 'pt'];
    for (const lang of expected) {
      expect(SUPPORTED_LANGS).toContain(lang);
    }
  });

  it('has a corresponding translations entry for every supported lang', () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(translations[lang]).toBeDefined();
    }
  });
});

describe('translations', () => {
  const langs = Object.keys(translations) as LangCode[];

  it('every language has a non-empty nav.home string', () => {
    for (const lang of langs) {
      expect(translations[lang].nav.home.length).toBeGreaterThan(0);
    }
  });

  it('every language has a non-empty hero.tagline string', () => {
    for (const lang of langs) {
      expect(translations[lang].hero.tagline.length).toBeGreaterThan(0);
    }
  });

  it('every language has a non-empty hero.buyNow string', () => {
    for (const lang of langs) {
      expect(translations[lang].hero.buyNow.length).toBeGreaterThan(0);
    }
  });

  it('every language has a non-empty tokenomics.title string', () => {
    for (const lang of langs) {
      expect(translations[lang].tokenomics.title.length).toBeGreaterThan(0);
    }
  });

  it('Portuguese translations are correct', () => {
    const pt = translations['pt'];
    expect(pt.nav.home).toBe('Início');
    expect(pt.nav.howToBuy).toBe('Como Comprar');
    expect(pt.hero.buyNow).toBe('Comprar CET');
    expect(pt.tokenomics.supply).toBe('Oferta Total');
  });
});

describe('language detection from localStorage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
    vi.stubGlobal('navigator', { language: 'en-US' });
  });

  it('SUPPORTED_LANGS contains pt for Portuguese speakers', () => {
    expect(SUPPORTED_LANGS).toContain('pt');
  });

  it('SUPPORTED_LANGS does not contain unknown language codes', () => {
    expect(SUPPORTED_LANGS).not.toContain('xx');
    expect(SUPPORTED_LANGS).not.toContain('fr');
  });
});
