import { describe, it, expect } from "vitest";
import translations, { type LangCode } from "../i18n/translations";
import { SUPPORTED_LANGS } from "../hooks/useLanguage";

/**
 * Recursively collects every dot-separated key path from an object.
 * E.g. { a: { b: 1, c: 2 } }  →  ["a.b", "a.c"]
 */
function collectKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return collectKeys(value as Record<string, unknown>, full);
    }
    return [full];
  });
}

const REFERENCE_LANG: LangCode = "en";
const referenceKeys = collectKeys(
  translations[REFERENCE_LANG] as unknown as Record<string, unknown>
).sort();

describe("translations completeness", () => {
  it("SUPPORTED_LANGS matches the translation map keys", () => {
    expect(SUPPORTED_LANGS.slice().sort()).toEqual(
      Object.keys(translations).sort()
    );
  });

  for (const lang of SUPPORTED_LANGS) {
    it(`'${lang}' has all the same keys as the reference language '${REFERENCE_LANG}'`, () => {
      const langKeys = collectKeys(
        translations[lang] as unknown as Record<string, unknown>
      ).sort();
      expect(langKeys).toEqual(referenceKeys);
    });

    it(`all values in '${lang}' are non-empty strings`, () => {
      const langObj = translations[lang] as unknown as Record<string, unknown>;
      const keys = collectKeys(langObj);
      for (const key of keys) {
        const parts = key.split(".");
        let value: unknown = langObj;
        for (const part of parts) {
          value = (value as Record<string, unknown>)[part];
        }
        expect(typeof value, `key '${key}' in lang '${lang}'`).toBe("string");
        expect((value as string).length, `key '${key}' in lang '${lang}'`).toBeGreaterThan(0);
      }
    });
  }
});
