/**
 * translations.test.ts
 *
 * Validates that every supported language has a complete translation object —
 * i.e. no keys are missing relative to the reference English translation.
 *
 * This is a structural test; it does not assert the correctness of any
 * individual translation string, only that every key present in `en` is
 * also present (and is a non-empty string) in every other language.
 */
import { describe, it, expect } from "vitest";
import translations, { type LangCode } from "../i18n/translations";

const SUPPORTED_LANGS: LangCode[] = ["en", "es", "zh", "ru", "ro"];
const REFERENCE_LANG: LangCode = "en";

/**
 * Recursively collect all dot-separated key paths from a nested object.
 * e.g. { nav: { home: 'Home' } } → ['nav.home']
 */
function collectPaths(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
    collectPaths(value, prefix ? `${prefix}.${key}` : key)
  );
}

/**
 * Retrieve a deeply nested value by a dot-path.
 */
function getPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce((acc: unknown, key) =>
      acc != null && typeof acc === "object"
        ? (acc as Record<string, unknown>)[key]
        : undefined,
      obj
    );
}

describe("translations", () => {
  const referencePaths = collectPaths(translations[REFERENCE_LANG]);

  it("has reference paths for all expected top-level namespaces", () => {
    expect(referencePaths.some(p => p.startsWith("nav."))).toBe(true);
    expect(referencePaths.some(p => p.startsWith("hero."))).toBe(true);
    expect(referencePaths.some(p => p.startsWith("tokenomics."))).toBe(true);
  });

  SUPPORTED_LANGS.forEach(lang => {
    describe(`language: ${lang}`, () => {
      it("is defined in the translations map", () => {
        expect(translations[lang]).toBeDefined();
        expect(typeof translations[lang]).toBe("object");
      });

      referencePaths.forEach(path => {
        it(`has a non-empty string for key "${path}"`, () => {
          const value = getPath(translations[lang], path);
          expect(typeof value).toBe("string");
          expect((value as string).trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  it("all supported languages are present in the translations map", () => {
    SUPPORTED_LANGS.forEach(lang => {
      expect(Object.prototype.hasOwnProperty.call(translations, lang)).toBe(true);
    });
  });

  it("no language has extra keys not in the reference", () => {
    SUPPORTED_LANGS.forEach(lang => {
      const langPaths = collectPaths(translations[lang]);
      langPaths.forEach(path => {
        const refValue = getPath(translations[REFERENCE_LANG], path);
        expect(
          refValue,
          `Key "${path}" in "${lang}" has no counterpart in "${REFERENCE_LANG}"`
        ).toBeDefined();
      });
    });
  });
});
