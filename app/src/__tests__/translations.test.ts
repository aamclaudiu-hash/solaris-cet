import { describe, it, expect } from "vitest";
import translations from "../i18n/translations";
import { SUPPORTED_LANGS } from "../hooks/useLanguage";

/**
 * Unit tests for the i18n translations and language configuration.
 *
 * These tests verify that the translations object is structurally correct
 * and that all supported languages have the same top-level sections —
 * preventing missing translation regressions.
 */

describe("SUPPORTED_LANGS", () => {
  it("includes English as a supported language", () => {
    expect(SUPPORTED_LANGS).toContain("en");
  });

  it("has at least 2 supported languages", () => {
    expect(SUPPORTED_LANGS.length).toBeGreaterThanOrEqual(2);
  });

  it("contains only strings", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(typeof lang).toBe("string");
      expect(lang.length).toBeGreaterThan(0);
    }
  });
});

describe("translations", () => {
  it("has a translations object for every supported language", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(translations).toHaveProperty(lang);
      expect(translations[lang]).toBeTruthy();
    }
  });

  it("all language translations share the same top-level sections", () => {
    const refSections = Object.keys(translations.en).sort();
    for (const lang of SUPPORTED_LANGS) {
      const langSections = Object.keys(translations[lang]).sort();
      expect(langSections).toEqual(refSections);
    }
  });

  it("all language translations have the same 'nav' keys", () => {
    const refNavKeys = Object.keys(translations.en.nav).sort();
    for (const lang of SUPPORTED_LANGS) {
      const langNavKeys = Object.keys(translations[lang].nav).sort();
      expect(langNavKeys).toEqual(refNavKeys);
    }
  });

  it("all language translations have the same 'hero' keys", () => {
    const refHeroKeys = Object.keys(translations.en.hero).sort();
    for (const lang of SUPPORTED_LANGS) {
      const langHeroKeys = Object.keys(translations[lang].hero).sort();
      expect(langHeroKeys).toEqual(refHeroKeys);
    }
  });

  it("all language translations have the same 'tokenomics' keys", () => {
    const refKeys = Object.keys(translations.en.tokenomics).sort();
    for (const lang of SUPPORTED_LANGS) {
      const langKeys = Object.keys(translations[lang].tokenomics).sort();
      expect(langKeys).toEqual(refKeys);
    }
  });

  it("English nav translations are non-empty strings", () => {
    for (const [key, value] of Object.entries(translations.en.nav)) {
      expect(typeof value, `nav.${key} should be a string`).toBe("string");
      expect((value as string).length, `nav.${key} should not be empty`).toBeGreaterThan(0);
    }
  });

  it("English hero translations are non-empty strings", () => {
    for (const [key, value] of Object.entries(translations.en.hero)) {
      expect(typeof value, `hero.${key} should be a string`).toBe("string");
      expect((value as string).length, `hero.${key} should not be empty`).toBeGreaterThan(0);
    }
  });
});
