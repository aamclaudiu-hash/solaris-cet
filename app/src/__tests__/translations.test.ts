import { describe, it, expect } from "vitest";
import translations, { type LangCode } from "../i18n/translations";

/**
 * Recursively collect all dot-separated key paths from a nested object.
 * e.g. { nav: { home: 'Home' } } → ['nav.home']
 */
function collectKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.keys(obj as Record<string, unknown>).flatMap((key) =>
    collectKeys(
      (obj as Record<string, unknown>)[key],
      prefix ? `${prefix}.${key}` : key
    )
  );
}

const langCodes = Object.keys(translations) as LangCode[];
const enKeys = collectKeys(translations["en"]).sort();

describe("translations", () => {
  it("includes all expected language codes", () => {
    const expected: LangCode[] = ["en", "es", "zh", "ru", "ro"];
    expect(langCodes.sort()).toEqual(expected.sort());
  });

  for (const lang of langCodes) {
    it(`'${lang}' has exactly the same keys as 'en' (no missing or extra keys)`, () => {
      const langKeys = collectKeys(translations[lang]).sort();
      expect(langKeys).toEqual(enKeys);
    });

    it(`all '${lang}' translation values are non-empty strings`, () => {
      const flat = collectKeys(translations[lang]);
      for (const path of flat) {
        const parts = path.split(".");
        // Traverse to the leaf value
        let value: unknown = translations[lang];
        for (const part of parts) {
          value = (value as Record<string, unknown>)[part];
        }
        expect(
          typeof value === "string" && value.trim().length > 0,
          `'${lang}.${path}' should be a non-empty string, got: ${JSON.stringify(value)}`
        ).toBe(true);
      }
    });
  }
});
