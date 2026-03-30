import { describe, it, expect } from 'vitest';
import {
  ORACLE_TASK_MESH_LINE,
  buildAgentPoolMeshLogMessage,
  buildDeepLatticeMeshLogMessage,
  buildDeepLatticeMeshLogMessageRawQuery,
  buildRavBurstLogMessage,
  buildSkillLocusLogMessage,
  buildTeamAgentMeshLogMessage,
  ORACLE_LATTICE_PHASE,
} from '@/lib/oracleTelemetry';

describe('oracleTelemetry barrel', () => {
  it('re-exports TASK_MESH line for SKILL terminal styling', () => {
    expect(ORACLE_TASK_MESH_LINE.startsWith('TASK_MESH:')).toBe(true);
    expect(ORACLE_TASK_MESH_LINE).toContain('200k');
  });

  it('observe_parse mesh sequence is deterministic for fixed q + topic', () => {
    const q = 'How do 200k agents route tasks?';
    const detected = 'team';
    const lines = [
      buildRavBurstLogMessage(q),
      ORACLE_TASK_MESH_LINE,
      buildAgentPoolMeshLogMessage(detected, q),
      buildTeamAgentMeshLogMessage(q, detected),
      buildDeepLatticeMeshLogMessage('INPUT_MESH', q, ORACLE_LATTICE_PHASE.inputStream),
      buildSkillLocusLogMessage(q, detected),
      buildDeepLatticeMeshLogMessage('PARSE_MESH', q, ORACLE_LATTICE_PHASE.observeParse),
    ];
    expect(lines).toMatchSnapshot();
  });

  it('deep lattice + act phase lines stay stable', () => {
    const q = 'oracle snapshot';
    const detected = 'default';
    expect(buildDeepLatticeMeshLogMessageRawQuery('DEEP_LATTICE', q)).toBe(
      buildDeepLatticeMeshLogMessageRawQuery('DEEP_LATTICE', q)
    );
    expect(buildDeepLatticeMeshLogMessage('ACT_MESH', q, ORACLE_LATTICE_PHASE.actExecute)).toContain(
      'ACT_MESH:'
    );
    expect(buildSkillLocusLogMessage(q, detected)).toContain('topic=default');
  });
});
