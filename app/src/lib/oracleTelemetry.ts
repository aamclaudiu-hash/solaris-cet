/**
 * Oracle RAV terminal: mesh lattice lines, agent pool / team whispers, and QUANTUM burst lines.
 * Re-exports split modules for one import path from UI and tests.
 */
export * from './oracleMeshLines';
export * from './oracleBurstLines';

/** Static INFO line after RAV_BURST in observe_parse — terminal treats as SKILL row. */
export const ORACLE_TASK_MESH_LINE =
  'TASK_MESH: ~200k task agents · delegated sub-queries · Oracle consolidation';
