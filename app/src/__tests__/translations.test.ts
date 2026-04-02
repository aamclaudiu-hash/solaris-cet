import { describe, it, expect } from "vitest";
import translations, { type LangCode, type Translations } from "../i18n/translations";
import { SUPPORTED_LANGS } from "../hooks/useLanguage";
import { hasBalancedSimpleBoldMarkers } from "../lib/simpleBoldMarkers";

/**
 * Recursively collect all dot-separated leaf key paths from a nested object.
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

/**
 * Retrieve a nested value using a dot-separated key path.
 */
function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc !== null && typeof acc === "object"
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      obj
    );
}

/** Keys that may contain `**` and are rendered with `renderSimpleBold` in hero / authority sections. */
const HERO_BOLD_KEYS: Array<keyof Translations["hero"]> = [
  "tagline",
  "subtitle",
  "buyNow",
  "learnMore",
  "description",
  "startMining",
  "docs",
  "miningStartAria",
  "miningProcessingAria",
  "miningSuccessAria",
  "liveTickerAria",
  "nextStepsLabel",
  "nextStepBuy",
  "nextStepTokenomics",
  "nextStepHowToBuy",
  "miningTelegramHint",
];

const AUTHORITY_TRUST_BOLD_KEYS: Array<keyof Translations["authorityTrust"]> = [
  "kicker",
  "title",
  "subtitle",
  "pillar1Title",
  "pillar1Body",
  "pillar2Title",
  "pillar2Body",
  "pillar3Title",
  "pillar3Body",
  "pillar4Title",
  "pillar4Body",
];

const BOLD_SCOPES = [
  { scope: "hero" as const, keys: HERO_BOLD_KEYS },
  { scope: "authorityTrust" as const, keys: AUTHORITY_TRUST_BOLD_KEYS },
] as const;

const NAV_EXPECTED_KEYS: Array<keyof Translations["nav"]> = [
  "home",
  "cetApp",
  "tokenomics",
  "roadmap",
  "team",
  "howToBuy",
  "whitepaper",
  "resources",
  "faq",
  "competition",
  "buyOnDedust",
  "sheetDescription",
  "openMenu",
  "primaryNavigation",
  "opensInNewWindow",
];

const FOOTER_NAV_EXPECTED_KEYS: Array<keyof Translations["footerNav"]> = [
  "privacy",
  "terms",
  "contact",
  "authorityTrust",
  "sovereignNoJs",
  "github",
];

const TOKENOMICS_EXPECTED_KEYS: Array<keyof Translations["tokenomics"]> = [
  "title",
  "supply",
  "poolAddress",
  "subtitle",
  "fixedSupply",
  "ravProtocol",
  "ravStack",
  "btcSReference",
  "cetCapLabel",
];

const referenceLang: LangCode = "en";
const referenceKeys = collectKeys(
  translations[referenceLang] as unknown as Record<string, unknown>
);

describe("translations — language coverage", () => {
  it("translation map ↔ SUPPORTED_LANGS (same set)", () => {
    const translationKeys = Object.keys(translations) as LangCode[];
    expect(new Set(translationKeys)).toEqual(new Set(SUPPORTED_LANGS));
  });
});

describe("translations — key completeness", () => {
  it("every language matches English (key set + value shape)", () => {
    const enKeysSorted = collectKeys(
      translations.en as unknown as Record<string, unknown>
    ).sort();

    for (const lang of SUPPORTED_LANGS) {
      const entry = translations[lang] as unknown as Record<string, unknown>;
      expect(collectKeys(entry).sort(), `${lang} keys`).toEqual(enKeysSorted);

      const nullish: string[] = [];
      const empty: string[] = [];
      const badType: string[] = [];

      for (const key of referenceKeys) {
        const value = getValueByPath(entry, key);
        if (value === undefined || value === null) {
          nullish.push(key);
        } else if (Array.isArray(value)) {
          if (
            !value.every(
              (v) => typeof v === "string" && v.trim().length > 0,
            )
          ) {
            badType.push(key);
          }
        } else if (typeof value === "string") {
          if (value.trim() === "") empty.push(key);
        } else {
          badType.push(key);
        }
      }

      expect(
        { lang, nullish, empty, badType },
        `${lang}: nullish / empty / badType`,
      ).toEqual({
        lang,
        nullish: [],
        empty: [],
        badType: [],
      });
    }
  });
});

describe("translations — specific content", () => {
  it("English tagline + all locales (copy, sections, mining disclaimer)", () => {
    expect(translations.en.hero.tagline).toContain("Cetățuia");

    for (const lang of SUPPORTED_LANGS) {
      const t = translations[lang];
      expect(t.hero.buyNow.trim().length).toBeGreaterThan(0);
      expect(t.nav.competition.trim().length).toBeGreaterThan(0);
      expect(t.miningCalculator.estimateDisclaimer.trim().length).toBeGreaterThan(
        0,
      );
      for (const key of NAV_EXPECTED_KEYS) {
        expect(t.nav[key], `${lang}.nav.${String(key)}`).toBeTruthy();
      }
      for (const key of HERO_BOLD_KEYS) {
        expect(t.hero[key], `${lang}.hero.${String(key)}`).toBeTruthy();
      }
      for (const key of FOOTER_NAV_EXPECTED_KEYS) {
        expect(t.footerNav[key], `${lang}.footerNav.${String(key)}`).toBeTruthy();
      }
      for (const key of TOKENOMICS_EXPECTED_KEYS) {
        expect(t.tokenomics[key], `${lang}.tokenomics.${String(key)}`).toBeTruthy();
      }
    }
  });
});

describe("translations — balanced ** (hero + authorityTrust)", () => {
  it("all languages", () => {
    for (const lang of SUPPORTED_LANGS) {
      const t = translations[lang];
      for (const { scope, keys } of BOLD_SCOPES) {
        const block = t[scope] as Record<string, string>;
        for (const key of keys) {
          const value = block[key];
          expect(
            hasBalancedSimpleBoldMarkers(value),
            `${lang}.${scope}.${String(key)}: ${JSON.stringify(value.slice(0, 72))}…`,
          ).toBe(true);
        }
      }
    }
  });
});
