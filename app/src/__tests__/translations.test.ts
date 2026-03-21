import { describe, it, expect } from "vitest";
import translations, {
  type LangCode,
  type Translations,
} from "../i18n/translations";

const SUPPORTED_LANGS: LangCode[] = ["en", "es", "zh", "ru", "ro"];

/**
 * Recursively collect all leaf key paths from an object, e.g.:
 *   { nav: { home: "Home" } } → ["nav.home"]
 */
function collectLeafPaths(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    collectLeafPaths(v, prefix ? `${prefix}.${k}` : k)
  );
}

/**
 * Read a nested value by dot-separated path, e.g. "nav.home" → string.
 */
function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc !== null && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

const enPaths = collectLeafPaths(translations.en);

describe("translations", () => {
  it("exports all five supported languages", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(translations).toHaveProperty(lang);
    }
  });

  it("every language has every key that English has", () => {
    for (const lang of SUPPORTED_LANGS) {
      const t = translations[lang] as Translations;
      for (const path of enPaths) {
        const value = getByPath(t, path);
        expect(
          value,
          `[${lang}] missing key: "${path}"`
        ).toBeDefined();
      }
    }
  });

  it("every translation value is a non-empty string", () => {
    for (const lang of SUPPORTED_LANGS) {
      const t = translations[lang] as Translations;
      for (const path of enPaths) {
        const value = getByPath(t, path);
        expect(
          typeof value,
          `[${lang}] key "${path}" should be a string`
        ).toBe("string");
        expect(
          (value as string).trim().length,
          `[${lang}] key "${path}" should not be empty`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("no language has extra keys not present in English", () => {
    for (const lang of SUPPORTED_LANGS) {
      if (lang === "en") continue;
      const otherPaths = collectLeafPaths(translations[lang]);
      for (const path of otherPaths) {
        const enValue = getByPath(translations.en, path);
        expect(
          enValue,
          `[${lang}] has extra key not in English: "${path}"`
        ).toBeDefined();
      }
    }
  });

  it("navigation keys are present for all languages", () => {
    const navKeys: Array<keyof Translations["nav"]> = [
      "home",
      "cetApp",
      "tokenomics",
      "roadmap",
      "howToBuy",
      "whitepaper",
      "resources",
    ];
    for (const lang of SUPPORTED_LANGS) {
      for (const key of navKeys) {
        expect(translations[lang].nav[key]).toBeTruthy();
      }
    }
  });

  it("hero keys are present for all languages", () => {
    const heroKeys: Array<keyof Translations["hero"]> = [
      "tagline",
      "subtitle",
      "buyNow",
      "learnMore",
    ];
    for (const lang of SUPPORTED_LANGS) {
      for (const key of heroKeys) {
        expect(translations[lang].hero[key]).toBeTruthy();
      }
    }
  });

  it("tokenomics keys are present for all languages", () => {
    const tokenomicsKeys: Array<keyof Translations["tokenomics"]> = [
      "title",
      "supply",
      "poolAddress",
    ];
    for (const lang of SUPPORTED_LANGS) {
      for (const key of tokenomicsKeys) {
        expect(translations[lang].tokenomics[key]).toBeTruthy();
      }
    }
  });
});
