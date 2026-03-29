import { solarisDepartments } from '@/data/solarisDepartments';
import { synthesizeMeshSkills, type SynthesisTier } from '@/lib/skillGenome';

/** AgentBoard `dept.name` → `solarisDepartments.id` */
const BOARD_DEPT_TO_MESH_ID: Record<string, string> = {
  'Customer Ops': 'customer-ops',
  Engineering: 'engineering',
  Sales: 'sales',
  'Data & AI': 'data-intelligence',
  Finance: 'finance',
  Marketing: 'marketing',
  Product: 'product-design',
  Security: 'security',
  Legal: 'legal',
  Research: 'research',
};

const MAX_BOARD_LEN = 158;

export function truncateBoardSkillMessage(s: string): string {
  return s.length <= MAX_BOARD_LEN ? s : `${s.slice(0, MAX_BOARD_LEN - 1)}…`;
}

/**
 * One recombinant skill line for the live agent board, keyed by dept + monotonic seq.
 */
export function buildSkillLatticeLine(deptName: string, seq: number): string | null {
  const meshId = BOARD_DEPT_TO_MESH_ID[deptName];
  const dept = solarisDepartments.find((d) => d.id === meshId);
  if (!dept) return null;

  const role = dept.roles[seq % dept.roles.length];
  if (!role) return null;

  const tiers: SynthesisTier[] = ['deep', 'standard', 'flash'];
  const tier = tiers[seq % tiers.length]!;
  const line = synthesizeMeshSkills(meshId, role.title, role.skills, 1, tier)[0];
  if (!line) return null;

  const raw = `${role.title}: ${line}`;
  return truncateBoardSkillMessage(raw);
}
