import { describe, it, expect } from "vitest";
import translations, { type LangCode } from "../i18n/translations";

/**
 * Tests that verify every supported language has the same translation keys
 * as English (the reference locale), and that no value is an empty string.
 *
 * This acts as an automated guard against partially-translated locales
 * being shipped to users.
 */

const SUPPORTED_LANGS: LangCode[] = ["en", "es", "zh", "ru", "ro"];

/** Recursively collect all dot-separated key paths from an object. */
function collectKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      return collectKeys(v as Record<string, unknown>, path);
    }
    return [path];
  });
}

/** Resolve a dot-separated key path in a nested object. */
function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((curr, key) => {
    if (curr && typeof curr === "object") {
      return (curr as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

const enKeys = collectKeys(translations.en as unknown as Record<string, unknown>);

describe("translations completeness", () => {
  for (const lang of SUPPORTED_LANGS) {
    describe(`locale: ${lang}`, () => {
      it("has all keys present in the English reference locale", () => {
        const t = translations[lang] as unknown as Record<string, unknown>;
        const missing = enKeys.filter((key) => getByPath(t, key) === undefined);
        expect(missing, `Missing keys in '${lang}': ${missing.join(", ")}`).toHaveLength(0);
      });

      it("has no empty string values", () => {
        const t = translations[lang] as unknown as Record<string, unknown>;
        const empty = enKeys.filter((key) => getByPath(t, key) === "");
        expect(empty, `Empty values in '${lang}': ${empty.join(", ")}`).toHaveLength(0);
      });

      it("has no keys that don't exist in the English reference locale", () => {
        const t = translations[lang] as unknown as Record<string, unknown>;
        const langKeys = collectKeys(t);
        const extra = langKeys.filter((key) => !enKeys.includes(key));
        expect(extra, `Extra keys in '${lang}': ${extra.join(", ")}`).toHaveLength(0);
      });
    });
  }
});

describe("translation values are strings", () => {
  for (const lang of SUPPORTED_LANGS) {
    it(`all leaf values are strings in '${lang}'`, () => {
      const t = translations[lang] as unknown as Record<string, unknown>;
      const nonStrings = enKeys.filter((key) => typeof getByPath(t, key) !== "string");
      expect(
        nonStrings,
        `Non-string values in '${lang}': ${nonStrings.join(", ")}`
      ).toHaveLength(0);
    });
  }
});

describe("English locale — spot checks", () => {
  it("nav.home is 'Home'", () => {
    expect(translations.en.nav.home).toBe("Home");
  });

  it("hero.buyNow is non-empty", () => {
    expect(translations.en.hero.buyNow.length).toBeGreaterThan(0);
  });

  it("tokenomics.supply is non-empty", () => {
    expect(translations.en.tokenomics.supply.length).toBeGreaterThan(0);
  });
});
