import { describe, it, expect } from 'vitest';
import {
  buildAgentPoolMeshLogMessage,
  buildTeamAgentMeshLogMessage,
  buildDeepLatticeMeshLogMessage,
  buildDeepLatticeMeshLogMessageRawQuery,
  buildSkillLocusLogMessage,
  CET_AI_LATTICE_PHASE,
} from '@/lib/cetAiMeshLines';

describe('cetAiMeshLines', () => {
  it('buildAgentPoolMeshLogMessage has fixed prefix and stable burst', () => {
    const a = buildAgentPoolMeshLogMessage('team', 'How do agents collaborate?');
    const b = buildAgentPoolMeshLogMessage('team', 'How do agents collaborate?');
    expect(a).toBe(b);
    expect(a.startsWith('AGENT_POOL_MESH: ')).toBe(true);
    expect(a.length).toBeLessThan(160);
  });

  it('buildTeamAgentMeshLogMessage has fixed prefix and stable whisper', () => {
    const a = buildTeamAgentMeshLogMessage('team scale', 'team');
    const b = buildTeamAgentMeshLogMessage('team scale', 'team');
    expect(a).toBe(b);
    expect(a.startsWith('TEAM_AGENT_MESH: ')).toBe(true);
    expect(a).toContain('—');
  });

  it('different queries change agent pool line', () => {
    const x = buildAgentPoolMeshLogMessage('default', 'aaa');
    const y = buildAgentPoolMeshLogMessage('default', 'bbb');
    expect(x).not.toBe(y);
  });

  it('buildDeepLatticeMeshLogMessage matches prior INPUT_MESH / PARSE shape', () => {
    const q = 'test cet ai lattice';
    const input = buildDeepLatticeMeshLogMessage('INPUT_MESH', q, CET_AI_LATTICE_PHASE.inputStream);
    expect(input.startsWith('INPUT_MESH: ')).toBe(true);
    expect(input).toContain(' · ');
    const parse = buildDeepLatticeMeshLogMessage('PARSE_MESH', q, CET_AI_LATTICE_PHASE.observeParse);
    expect(parse.startsWith('PARSE_MESH: ')).toBe(true);
    expect(input).toBe(buildDeepLatticeMeshLogMessage('INPUT_MESH', q, 'inputStream'));
  });

  it('buildDeepLatticeMeshLogMessageRawQuery is stable for DEEP_LATTICE', () => {
    const q = 'raw lattice query';
    const a = buildDeepLatticeMeshLogMessageRawQuery('DEEP_LATTICE', q);
    const b = buildDeepLatticeMeshLogMessageRawQuery('DEEP_LATTICE', q);
    expect(a).toBe(b);
    expect(a.startsWith('DEEP_LATTICE: ')).toBe(true);
  });

  it('buildSkillLocusLogMessage includes topic and locus clip', () => {
    const line = buildSkillLocusLogMessage('What is mining?', 'mining');
    expect(line.startsWith('SKILL_LOCUS: ')).toBe(true);
    expect(line).toContain('topic=mining');
  });

  it('CET_AI_LATTICE_PHASE keys cover all deep-lattice telemetry phases', () => {
    expect(Object.keys(CET_AI_LATTICE_PHASE).sort()).toEqual(
      [
        'actExecute',
        'inputStream',
        'meshSeal',
        'observeContext',
        'observeParse',
        'sessionClose',
        'thinkRoute',
        'thinkValidate',
        'verifyCross',
      ].sort()
    );
  });
});
