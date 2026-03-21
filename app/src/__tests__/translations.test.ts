import { describe, it, expect } from "vitest";
import translations, { type LangCode } from "../i18n/translations";

const LANG_CODES: LangCode[] = ["en", "es", "zh", "ru", "ro"];

/** Recursively collect all dot-separated leaf key paths of a plain object. */
function getLeafKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      return getLeafKeys(value as Record<string, unknown>, fullKey);
import translations from "../i18n/translations";
import { SUPPORTED_LANGS } from "../hooks/useLanguage";
import type { LangCode, Translations } from "../i18n/translations";

/**
 * Recursively collect all dot-separated key paths from a nested object.
 * E.g. { nav: { home: 'Home' } } → ['nav.home']
 */
function collectKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return collectKeys(value as Record<string, unknown>, fullKey);
    }
    return [fullKey];
  });
}

/** Retrieve a nested value using a dot-separated key path. */
function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  return path
    .split(".")
    .reduce<unknown>((acc, part) => {
      if (acc !== null && typeof acc === "object") {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
}

describe("translations", () => {
  it("exports an entry for every required language code", () => {
    for (const lang of LANG_CODES) {
      expect(translations[lang]).toBeDefined();
    }
  });

  it("all languages share identical key structure with English", () => {
    const enKeys = getLeafKeys(
      translations.en as unknown as Record<string, unknown>
    ).sort();

    for (const lang of LANG_CODES) {
      const langKeys = getLeafKeys(
        translations[lang] as unknown as Record<string, unknown>
      ).sort();
      expect(langKeys, `${lang} keys do not match English keys`).toEqual(enKeys);
/**
 * Recursively retrieve a value from a nested object using a dot-separated path.
 */
function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined), obj);
}

describe("i18n translations completeness", () => {
  const referenceLang: LangCode = "en";
  const referenceKeys = collectKeys(
    translations[referenceLang] as unknown as Record<string, unknown>
  );

  it("SUPPORTED_LANGS covers every translation in the translations map", () => {
    const translationKeys = Object.keys(translations) as LangCode[];
    for (const lang of translationKeys) {
      expect(SUPPORTED_LANGS).toContain(lang);
    }
  });

  it("every supported language has an entry in the translations map", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(translations).toHaveProperty(lang);
    }
  });

  for (const lang of SUPPORTED_LANGS) {
    describe(`language: ${lang}`, () => {
      it(`has all ${referenceKeys.length} keys from the reference (${referenceLang}) translation`, () => {
        const missing: string[] = [];
        for (const key of referenceKeys) {
          const value = getValueByPath(
            translations[lang] as unknown as Record<string, unknown>,
            key
          );
          if (value === undefined) missing.push(key);
        }
        expect(missing).toEqual([]);
      });

      it("has no empty string values", () => {
        const empty: string[] = [];
        for (const key of referenceKeys) {
          const value = getValueByPath(
            translations[lang] as unknown as Record<string, unknown>,
            key
          );
          if (typeof value === "string" && value.trim() === "") {
            empty.push(key);
          }
        }
        expect(empty).toEqual([]);
      });

      it("has no key with value undefined or null", () => {
        const nullish: string[] = [];
        for (const key of referenceKeys) {
          const value = getValueByPath(
            translations[lang] as unknown as Record<string, unknown>,
            key
          );
          if (value === undefined || value === null) nullish.push(key);
        }
        expect(nullish).toEqual([]);
      });
    });
  }
});

describe("i18n translations", () => {
  const englishKeys = collectKeys(translations.en as unknown as Record<string, unknown>);

  it("has entries for every supported language", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(translations).toHaveProperty(lang);
    }
  });

  it("every language contains all keys present in English", () => {
    for (const lang of SUPPORTED_LANGS) {
      if (lang === "en") continue;
      const langKeys = collectKeys(translations[lang] as unknown as Record<string, unknown>);
      for (const key of englishKeys) {
        expect(langKeys, `'${lang}' is missing key '${key}'`).toContain(key);
      }
    }
  });

  it("no language contains extra keys not present in English", () => {
    for (const lang of SUPPORTED_LANGS) {
      if (lang === "en") continue;
      const langKeys = collectKeys(translations[lang] as unknown as Record<string, unknown>);
      for (const key of langKeys) {
        expect(englishKeys, `'${lang}' has unexpected key '${key}'`).toContain(key);
      }
    }
  });

  it("all translation values are non-empty strings", () => {
    for (const lang of LANG_CODES) {
      const root = translations[lang] as unknown as Record<string, unknown>;
      const keys = getLeafKeys(root);
      for (const key of keys) {
        const value = getNestedValue(root, key);
        expect(
          typeof value,
          `${lang}.${key} should be a string`
        ).toBe("string");
        expect(
          (value as string).trim().length,
          `${lang}.${key} should not be empty`
    for (const lang of SUPPORTED_LANGS) {
      const entry = translations[lang] as Translations;
      const langObj = entry as unknown as Record<string, unknown>;
      const keys = collectKeys(langObj);
      for (const key of keys) {
        const parts = key.split(".");
        let value: unknown = langObj;
        for (const part of parts) {
          value = (value as Record<string, unknown>)[part];
        }
        expect(
          typeof value,
          `'${lang}.${key}' should be a string`
        ).toBe("string");
        expect(
          (value as string).trim().length,
          `'${lang}.${key}' should not be empty`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("nav section contains all expected keys for every language", () => {
    const expectedNavKeys = [
      "home",
      "cetApp",
      "tokenomics",
      "roadmap",
      "howToBuy",
      "whitepaper",
      "resources",
    ];
    for (const lang of LANG_CODES) {
      for (const key of expectedNavKeys) {
        expect(
          translations[lang].nav[key as keyof typeof translations.en.nav],
          `${lang}.nav.${key} missing`
        ).toBeTruthy();
      }
    }
  });

  it("hero section contains all expected keys for every language", () => {
    const expectedHeroKeys: Array<keyof typeof translations.en.hero> = [
      "tagline",
      "subtitle",
      "buyNow",
      "learnMore",
    ];
    for (const lang of LANG_CODES) {
      for (const key of expectedHeroKeys) {
        expect(
          translations[lang].hero[key],
          `${lang}.hero.${key} missing`
        ).toBeTruthy();
      }
    }
  });

  it("tokenomics section contains all expected keys for every language", () => {
    const expectedTokenomicsKeys: Array<
      keyof typeof translations.en.tokenomics
    > = ["title", "supply", "poolAddress"];
    for (const lang of LANG_CODES) {
      for (const key of expectedTokenomicsKeys) {
        expect(
          translations[lang].tokenomics[key],
          `${lang}.tokenomics.${key} missing`
        ).toBeTruthy();
      }
  it("English tagline references Cetățuia", () => {
    expect(translations.en.hero.tagline).toContain("Cetățuia");
  });

  it("buy button text is non-empty for all languages", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(translations[lang].hero.buyNow.trim().length).toBeGreaterThan(0);
    }
  });
});
