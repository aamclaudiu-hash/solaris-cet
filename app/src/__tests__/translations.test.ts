import { describe, it, expect } from "vitest";
import translations, { type LangCode } from "../i18n/translations";
import { SUPPORTED_LANGS } from "../hooks/useLanguage";

// ── helpers ──────────────────────────────────────────────────────────────────

/** Recursively collect every dot-separated key path in an object. */
function collectKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.keys(obj as Record<string, unknown>).flatMap((key) =>
    collectKeys(
      (obj as Record<string, unknown>)[key],
      prefix ? `${prefix}.${key}` : key
    )
  );
}

/** Recursively retrieve a value by dot-separated path. */
function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((acc, segment) =>
      acc != null && typeof acc === "object"
        ? (acc as Record<string, unknown>)[segment]
        : undefined,
    obj);
}

// ── constants tests ───────────────────────────────────────────────────────────

describe("SUPPORTED_LANGS", () => {
  it("contains exactly the five expected language codes", () => {
    expect(SUPPORTED_LANGS).toEqual(
      expect.arrayContaining(["en", "es", "zh", "ru", "ro"])
    );
    expect(SUPPORTED_LANGS).toHaveLength(5);
  });

  it("includes English as the default/fallback language", () => {
    expect(SUPPORTED_LANGS).toContain("en");
  });

  it("every code in SUPPORTED_LANGS has a corresponding translations entry", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(translations).toHaveProperty(lang);
    }
  });
});

// ── completeness tests ────────────────────────────────────────────────────────

describe("translations completeness", () => {
  const englishKeys = collectKeys(translations.en as unknown);

  it("English translations have the required top-level sections", () => {
    expect(translations.en).toHaveProperty("nav");
    expect(translations.en).toHaveProperty("hero");
    expect(translations.en).toHaveProperty("tokenomics");
  });

  it("English nav has all seven navigation keys", () => {
    const nav = translations.en.nav;
    expect(Object.keys(nav)).toHaveLength(7);
    for (const key of [
      "home",
      "cetApp",
      "tokenomics",
      "roadmap",
      "howToBuy",
      "whitepaper",
      "resources",
    ]) {
      expect(nav).toHaveProperty(key);
    }
  });

  const nonEnglish = (Object.keys(translations) as LangCode[]).filter(
    (l) => l !== "en"
  );

  it.each(nonEnglish)(
    "%s has the same structure as English",
    (lang) => {
      const langKeys = collectKeys(translations[lang] as unknown);
      expect(langKeys.sort()).toEqual(englishKeys.sort());
    }
  );

  it.each(nonEnglish)(
    "%s has no empty string values",
    (lang) => {
      for (const key of englishKeys) {
        const value = getByPath(
          translations[lang] as unknown as Record<string, unknown>,
          key
        );
        expect(
          value,
          `${lang}.${key} should not be an empty string`
        ).not.toBe("");
      }
    }
  );

  it.each(nonEnglish)(
    "%s does not reuse English strings verbatim (spot-check nav.home)",
    (lang) => {
      // Each language's nav.home should be translated differently from English.
      expect(translations[lang].nav.home).not.toBe(translations.en.nav.home);
    }
  );
});

// ── content sanity tests ──────────────────────────────────────────────────────

describe("translations content sanity", () => {
  it("every language's buyNow value is a non-empty string", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(typeof translations[lang].hero.buyNow).toBe("string");
      expect(translations[lang].hero.buyNow.length).toBeGreaterThan(0);
    }
  });

  it("every language's tokenomics.title is a non-empty string", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(typeof translations[lang].tokenomics.title).toBe("string");
      expect(translations[lang].tokenomics.title.length).toBeGreaterThan(0);
    }
  });

  it("English hero subtitle mentions 9,000 CET supply", () => {
    expect(translations.en.hero.subtitle).toMatch(/9[,.]?000\s*CET/);
  });
});
