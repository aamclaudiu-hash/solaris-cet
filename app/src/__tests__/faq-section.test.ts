import { describe, it, expect } from 'vitest';
import translations from '../i18n/translations';

const en = translations.en.faqContent;

const QUESTION_KEYS = [
  'q1',
  'q2',
  'q3',
  'q4',
  'q5',
  'q6',
  'q7',
  'q8',
  'q9',
  'q10',
  'q11',
  'q12',
  'q13',
  'q14',
] as const;

describe('FAQSection — data integrity', () => {
  it('has 14 FAQ question keys', () => {
    expect(QUESTION_KEYS).toHaveLength(14);
  });

  it('all questions are non-empty strings', () => {
    QUESTION_KEYS.forEach((qk) => {
      const q = en[qk];
      expect(typeof q).toBe('string');
      expect(q.length).toBeGreaterThan(10);
    });
  });

  it('all questions end with a question mark', () => {
    QUESTION_KEYS.forEach((qk) => {
      expect(en[qk].endsWith('?')).toBe(true);
    });
  });

  it('questions are unique', () => {
    const questions = QUESTION_KEYS.map((qk) => en[qk]);
    const unique = new Set(questions);
    expect(unique.size).toBe(QUESTION_KEYS.length);
  });

  it('competition comparison question exists (q11)', () => {
    expect(en.q11.toLowerCase()).toMatch(/fetch|bittensor|singularity/);
  });

  it('BRAID Framework question exists (q12)', () => {
    expect(en.q12).toContain('BRAID');
  });

  it('RAV Protocol question exists (q13)', () => {
    expect(en.q13).toContain('RAV');
  });

  it('Zero-Battery Constraint question exists (q14)', () => {
    expect(en.q14).toContain('Zero-Battery');
  });

  it('link labels for FAQ CTAs are present', () => {
    expect(en.linkWhitepaper.length).toBeGreaterThan(3);
    expect(en.linkTelegram.length).toBeGreaterThan(3);
    expect(en.linkGithub.length).toBeGreaterThan(3);
    expect(en.linkComparison.length).toBeGreaterThan(3);
  });
});

// ─── FAQ accordion state logic ────────────────────────────────────────────

describe('FAQSection — accordion state logic', () => {
  function toggleFaq(openIndex: number | null, i: number): number | null {
    return openIndex === i ? null : i;
  }

  it('opens an item when none is open', () => {
    expect(toggleFaq(null, 0)).toBe(0);
  });

  it('closes an item when the same item is toggled', () => {
    expect(toggleFaq(2, 2)).toBeNull();
  });

  it('switches to a different item', () => {
    expect(toggleFaq(1, 3)).toBe(3);
  });

  it('first item can be opened', () => {
    expect(toggleFaq(null, 0)).toBe(0);
  });

  it('last item index is 13 (0-based)', () => {
    expect(toggleFaq(null, 13)).toBe(13);
  });
});
