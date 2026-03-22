import {
  Users, Code2, TrendingUp, Brain, Coins,
  Globe, Palette, Shield, FileCheck, Crown,
  MessageCircle, Lightbulb, CheckCircle, AlertTriangle,
} from 'lucide-react';
import { useAgentBoard, type EventKind } from '../hooks/useAgentBoard';

// ─── Department display config ───────────────────────────────────────────

interface DeptDisplay {
  name: string;
  color: string;
  bg: string;
  icon: typeof Users;
}

const DEPT_DISPLAY: Record<string, DeptDisplay> = {
  'Customer Ops': { name: 'Customer Ops', color: 'text-cyan-400',     bg: 'bg-cyan-400/10',     icon: Users     },
  'Engineering':  { name: 'Engineering',  color: 'text-blue-400',     bg: 'bg-blue-400/10',     icon: Code2     },
  'Sales':        { name: 'Sales',        color: 'text-emerald-400',  bg: 'bg-emerald-400/10',  icon: TrendingUp },
  'Data & AI':    { name: 'Data & AI',    color: 'text-purple-400',   bg: 'bg-purple-400/10',   icon: Brain     },
  'Finance':      { name: 'Finance',      color: 'text-solaris-gold', bg: 'bg-solaris-gold/10', icon: Coins     },
  'Marketing':    { name: 'Marketing',    color: 'text-orange-400',   bg: 'bg-orange-400/10',   icon: Globe     },
  'Product':      { name: 'Product',      color: 'text-pink-400',     bg: 'bg-pink-400/10',     icon: Palette   },
  'Security':     { name: 'Security',     color: 'text-red-400',      bg: 'bg-red-400/10',      icon: Shield    },
  'Legal':        { name: 'Legal',        color: 'text-amber-400',    bg: 'bg-amber-400/10',    icon: FileCheck },
  'Research':     { name: 'Research',     color: 'text-solaris-cyan', bg: 'bg-solaris-cyan/10', icon: Crown     },
};

const KIND_CONFIG: Record<EventKind, { icon: typeof MessageCircle; label: string; color: string }> = {
  solved:  { icon: CheckCircle,   label: 'SOLVED',  color: 'text-emerald-400' },
  learned: { icon: Lightbulb,     label: 'LEARNED', color: 'text-solaris-gold' },
  talking: { icon: MessageCircle, label: 'TALKING', color: 'text-solaris-cyan' },
  alert:   { icon: AlertTriangle, label: 'ALERT',   color: 'text-red-400' },
};

function timeSince(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

// ─── Component ────────────────────────────────────────────────────────────

/**
 * AgentBoard — a live activity feed showing Solaris CET's 200,000 autonomous
 * agents talking to each other, learning from colleagues, and solving problems
 * in real time. New events appear every ~2 seconds via the useAgentBoard hook.
 */
const AgentBoard = () => {
  const events = useAgentBoard({ maxEvents: 7, intervalMs: 2200 });

  return (
    <div className="glass-card p-4 lg:p-6 border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
          <span className="hud-label text-emerald-400">LIVE AGENT ACTIVITY</span>
        </div>
        <span className="font-mono text-solaris-muted text-[10px]">200,000 AGENTS ONLINE</span>
      </div>

      {/* Feed */}
      <ul className="space-y-2" aria-live="polite" aria-label="Live agent activity feed">
        {events.map((ev) => {
          const dept = DEPT_DISPLAY[ev.dept] ?? DEPT_DISPLAY['Engineering'];
          const DeptIcon = dept.icon;
          const kc = KIND_CONFIG[ev.kind];
          const KindIcon = kc.icon;

          return (
            <li
              key={ev.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 transition-all duration-300"
            >
              {/* Department badge */}
              <div className={`shrink-0 w-7 h-7 rounded-lg ${dept.bg} flex items-center justify-center`}>
                <DeptIcon className={`w-3.5 h-3.5 ${dept.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-mono text-[10px] font-bold ${dept.color}`}>
                    {ev.agentId}
                  </span>
                  <span className={`flex items-center gap-1 text-[10px] font-semibold ${kc.color}`}>
                    <KindIcon className="w-3 h-3" />
                    {kc.label}
                  </span>
                </div>
                <p className="text-solaris-muted text-xs leading-relaxed mt-0.5 truncate">
                  {ev.message}
                </p>
              </div>

              {/* Timestamp */}
              <span className="shrink-0 font-mono text-[9px] text-solaris-muted/50 mt-0.5">
                {timeSince(ev.ts)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AgentBoard;
