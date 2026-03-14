import { Droplets, Pickaxe, ShieldCheck, Megaphone } from 'lucide-react';

interface TokenomicsEntry {
  label: string;
  sublabel: string;
  amount: number;
  percentage: number;
  description: string;
  icon: React.ElementType;
  color: string;
  barColor: string;
}

const TOKENOMICS_DATA: TokenomicsEntry[] = [
  {
    label: 'LIQUIDITY',
    sublabel: 'DeDust Pool',
    amount: 5400,
    percentage: 60,
    description: 'Locked for Stability',
    icon: Droplets,
    color: 'text-solaris-cyan',
    barColor: 'bg-solaris-cyan',
  },
  {
    label: 'MINING',
    sublabel: '90 Years',
    amount: 1800,
    percentage: 20,
    description: 'Gradual Ecosystem Release',
    icon: Pickaxe,
    color: 'text-solaris-gold',
    barColor: 'bg-solaris-gold',
  },
  {
    label: 'ARCHITECT RESERVE',
    sublabel: 'Strategic',
    amount: 1350,
    percentage: 15,
    description: "Claudiu's Strategic Alignment",
    icon: ShieldCheck,
    color: 'text-emerald-400',
    barColor: 'bg-emerald-400',
  },
  {
    label: 'MARKETING',
    sublabel: 'Community',
    amount: 450,
    percentage: 5,
    description: 'Growth & Airdrops',
    icon: Megaphone,
    color: 'text-violet-400',
    barColor: 'bg-violet-400',
  },
];

const Tokenomics = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {TOKENOMICS_DATA.map((entry) => {
        const Icon = entry.icon;
        return (
          <div
            key={entry.label}
            className="p-4 rounded-xl bg-white/5 border border-solaris-gold/20 flex flex-col gap-3"
          >
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${entry.color} shrink-0`} />
                <div>
                  <div className={`font-mono text-[11px] font-semibold tracking-widest uppercase ${entry.color}`}>
                    {entry.label}
                  </div>
                  <div className="hud-label text-[9px]">{entry.sublabel}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-mono font-bold text-lg leading-none ${entry.color}`}>
                  {entry.percentage}%
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full ${entry.barColor}`}
                style={{ width: `${entry.percentage}%` }}
              />
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-solaris-text font-semibold text-sm">
                {entry.amount.toLocaleString()} CET
              </span>
              <span className="text-solaris-muted text-xs">{entry.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Tokenomics;
