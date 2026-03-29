import { describe, it, expect } from 'vitest';
import {
  AGENT_BOARD_DEPT_TO_MESH_ID,
  buildSkillLatticeLine,
  buildSkillLatticePayload,
  truncateBoardSkillMessage,
} from '@/lib/agentBoardSkillMix';

describe('agentBoardSkillMix', () => {
  it('AGENT_BOARD_DEPT_TO_MESH_ID covers 10 display departments', () => {
    expect(Object.keys(AGENT_BOARD_DEPT_TO_MESH_ID)).toHaveLength(10);
  });

  it('buildSkillLatticeLine is deterministic for fixed dept + seq', () => {
    const a = buildSkillLatticeLine('Engineering', 7);
    const b = buildSkillLatticeLine('Engineering', 7);
    expect(a).toBe(b);
    expect(a).toMatch(/^[^:]+:/);
  });

  it('buildSkillLatticePayload line matches buildSkillLatticeLine and includes roleTitle', () => {
    const p = buildSkillLatticePayload('Engineering', 4);
    expect(p).not.toBeNull();
    expect(p!.line).toBe(buildSkillLatticeLine('Engineering', 4));
    expect(p!.roleTitle.length).toBeGreaterThan(2);
    expect(p!.meshDeptId).toBe('engineering');
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
