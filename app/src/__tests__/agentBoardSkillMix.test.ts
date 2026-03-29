import { describe, it, expect } from 'vitest';
import { buildSkillLatticeLine, truncateBoardSkillMessage } from '@/lib/agentBoardSkillMix';

describe('agentBoardSkillMix', () => {
  it('buildSkillLatticeLine is deterministic for fixed dept + seq', () => {
    const a = buildSkillLatticeLine('Engineering', 7);
    const b = buildSkillLatticeLine('Engineering', 7);
    expect(a).toBe(b);
    expect(a).toMatch(/^[^:]+:/);
  });

  it('different seq yields different lines for same dept', () => {
    const a = buildSkillLatticeLine('Sales', 0);
    const b = buildSkillLatticeLine('Sales', 1);
    expect(a).not.toBe(b);
  });

  it('truncateBoardSkillMessage caps length', () => {
    const long = 'x'.repeat(200);
    expect(truncateBoardSkillMessage(long).length).toBeLessThanOrEqual(158);
    expect(truncateBoardSkillMessage(long).endsWith('…')).toBe(true);
  });

  it('returns null for unknown department name', () => {
    expect(buildSkillLatticeLine('Unknown Dept', 0)).toBeNull();
  });
});
