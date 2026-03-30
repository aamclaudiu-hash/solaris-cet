import {
  deepLatticeLineForQuery,
  observeLocusBranchFromTopic,
  observeLocusClip,
  meshStandardBurstFromKey,
  meshWhisperFromKey,
  skillSeedFromLabel,
} from '@/lib/meshSkillFeed';

/**
 * Suffixes passed to `deepLatticeLineForQuery(\`\${query}|\${phase}\`)` — keep in sync with
 * telemetry prefixes in AiOracleSearch.
 */
export const ORACLE_LATTICE_PHASE = {
  inputStream: 'inputStream',
  observeParse: 'observeParse',
  observeContext: 'observeContext',
  thinkRoute: 'thinkRoute',
  thinkValidate: 'thinkValidate',
  actExecute: 'actExecute',
  verifyCross: 'verifyCross',
  meshSeal: 'meshSeal',
  sessionClose: 'sessionClose',
} as const;

export type OracleLatticePhase = (typeof ORACLE_LATTICE_PHASE)[keyof typeof ORACLE_LATTICE_PHASE];

/**
 * Full telemetry line: `INPUT_MESH:`, `PARSE_MESH:`, `CONTEXT_MESH:`, etc.
 */
export function buildDeepLatticeMeshLogMessage(
  telemetryPrefix: string,
  query: string,
  latticePhase: OracleLatticePhase | string
): string {
  return `${telemetryPrefix}: ${deepLatticeLineForQuery(`${query}|${latticePhase}`)}`;
}

/**
 * `DEEP_LATTICE:` — uses raw query (no `|phase` suffix) like deepLatticeLineForQuery(q).
 */
export function buildDeepLatticeMeshLogMessageRawQuery(telemetryPrefix: string, query: string): string {
  return `${telemetryPrefix}: ${deepLatticeLineForQuery(query)}`;
}

export function buildSkillLocusLogMessage(query: string, detectedTopic: string): string {
  const branch = observeLocusBranchFromTopic(detectedTopic);
  return `SKILL_LOCUS: ${observeLocusClip(query, branch)} · topic=${detectedTopic}`;
}

/**
 * Full telemetry line for Oracle terminal (INFO) — matches `AGENT_POOL_MESH:` prefix in AiOracleSearch.
 */
export function buildAgentPoolMeshLogMessage(detectedTopic: string, query: string): string {
  return `AGENT_POOL_MESH: ${meshStandardBurstFromKey(`oracle|agentPool|${detectedTopic}|${skillSeedFromLabel(query)}`)}`;
}

/**
 * Full telemetry line for Oracle terminal — `TEAM_AGENT_MESH:` (team / ai topics).
 */
export function buildTeamAgentMeshLogMessage(query: string, detectedTopic: string): string {
  return `TEAM_AGENT_MESH: ${meshWhisperFromKey(`oracle|teamAgent|${query}|${detectedTopic}`)}`;
}
