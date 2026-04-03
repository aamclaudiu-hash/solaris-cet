import { describe, it, expect } from 'vitest';
import { cetAiQueryCharCountToneClass } from '@/lib/cetAiQueryUi';
import { CET_AI_MAX_QUERY_CHARS } from '@/lib/cetAiConstants';

describe('cetAiQueryCharCountToneClass', () => {
  it('uses neutral gray when more than 200 chars below cap', () => {
    expect(cetAiQueryCharCountToneClass(CET_AI_MAX_QUERY_CHARS - 201, CET_AI_MAX_QUERY_CHARS)).toBe(
      'text-gray-600',
    );
  });

  it('uses amber when within 200 chars of cap', () => {
    expect(cetAiQueryCharCountToneClass(CET_AI_MAX_QUERY_CHARS - 200, CET_AI_MAX_QUERY_CHARS)).toBe(
      'text-amber-400/90',
    );
    expect(cetAiQueryCharCountToneClass(CET_AI_MAX_QUERY_CHARS, CET_AI_MAX_QUERY_CHARS)).toBe(
      'text-amber-400/90',
    );
  });
});
