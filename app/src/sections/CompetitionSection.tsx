import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { CheckCircle, XCircle, Minus, Trophy, Zap, Shield, Brain, Coins } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import GlowOrbs from '../components/GlowOrbs';
import { skillSeedFromLabel, standardSkillBurst } from '@/lib/meshSkillFeed';
import { useLanguage } from '../hooks/useLanguage';
import { localeForLang } from '@/lib/localeForLang';

interface CompetitionBarTooltipPayload {
  value?: number;
  name?: string;
}

function CompetitionBarTooltip({
  active,
  payload,
  label,
  valueLabel,
  numberLocale,
}: {
  active?: boolean;
  payload?: readonly CompetitionBarTooltipPayload[];
  label?: string | number;
  valueLabel: string;
  numberLocale: string;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const name = String(label ?? p?.name ?? '');
  const v = p?.value;
  const skill = standardSkillBurst(skillSeedFromLabel(`competition|${valueLabel}|${name}`));
  const formatted =
    typeof v === 'number' ? v.toLocaleString(numberLocale, { maximumFractionDigits: 0 }) : String(v);
  return (
    <div className="rounded-lg border border-white/12 bg-[#0D0E17] px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.4)] max-w-[min(90vw,280px)]">
      <p className="font-mono text-sm font-bold text-solaris-text">{name}</p>
      <p className="text-xs text-solaris-muted mt-1 tabular-nums">
        {formatted} {valueLabel}
      </p>
      <p
        className="mt-2 pt-2 border-t border-fuchsia-500/20 text-[10px] font-mono text-fuchsia-200/85 leading-snug line-clamp-3"
        title={skill}
      >
        {skill}
      </p>
    </div>
  );
}

/** Format TPS values: 1000 → "1k", 100000 → "100k" */
function formatTpsAxis(v: number): string {
  return v >= 1000 ? `${v / 1000}k` : String(v);
}

/** Format supply values: 1B → "1B", 1M → "1M", 1K → "1K" */
function formatSupplyAxis(v: number): string {
  if (v >= 1e9) return `${(v / 1e9).toFixed(0)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return String(v);
}

interface Competitor {
  name: string;
  symbol: string;
  chain: string;
  supply: string;
  tps: string;
  agents: string;
  rwa: boolean | 'partial';
  dualAi: boolean;
  mining: boolean;
  auditKyc: boolean;
  marginalCost: string;
  isCET?: boolean;
}

const competitors: Competitor[] = [
  {
    name: 'Solaris CET',
    symbol: 'CET',
    chain: 'TON',
    supply: '9,000',
    tps: '100,000',
    agents: '200,000',
    rwa: true,
    dualAi: true,
    mining: true,
    auditKyc: true,
    marginalCost: '$0',
    isCET: true,
  },
  {
    name: 'Fetch.ai',
    symbol: 'FET',
    chain: 'Cosmos',
    supply: '1.15B',
    tps: '~1,000',
    agents: 'Marketplace',
    rwa: false,
    dualAi: false,
    mining: false,
    auditKyc: true,
    marginalCost: 'Variable',
  },
  {
    name: 'Bittensor',
    symbol: 'TAO',
    chain: 'Custom',
    supply: '21M',
    tps: '~1,000',
    agents: 'Subnet miners',
    rwa: false,
    dualAi: false,
    mining: true,
    auditKyc: true,
    marginalCost: 'Variable',
  },
  {
    name: 'SingularityNET',
    symbol: 'AGIX',
    chain: 'ETH/BNB',
    supply: '2B',
    tps: '~15',
    agents: 'Marketplace',
    rwa: false,
    dualAi: false,
    mining: false,
    auditKyc: true,
    marginalCost: 'Variable',
  },
  {
    name: 'Ocean Protocol',
    symbol: 'OCEAN',
    chain: 'ETH/Polygon',
    supply: '1.41B',
    tps: '~15',
    agents: 'Data agents',
    rwa: 'partial',
    dualAi: false,
    mining: false,
    auditKyc: true,
    marginalCost: 'Variable',
  },
  {
    name: 'ASI Alliance',
    symbol: 'ASI',
    chain: 'Multi',
    supply: '~4.6B',
    tps: '~1,000',
    agents: 'Marketplace',
    rwa: false,
    dualAi: false,
    mining: false,
    auditKyc: true,
    marginalCost: 'Variable',
  },
];

function BoolCell({ value }: { value: boolean | 'partial' }) {
  if (value === true) return <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />;
  if (value === 'partial') return <Minus className="w-4 h-4 text-solaris-gold mx-auto" />;
  return <XCircle className="w-4 h-4 text-red-400/60 mx-auto" />;
}

function TextCell({ value, isCET }: { value: string; isCET?: boolean }) {
  return (
    <span className={`font-mono text-xs ${isCET ? 'text-solaris-gold font-bold' : 'text-solaris-muted'}`}>
      {value}
    </span>
  );
}

/** TPS chart — matches matrix peers (incl. ASI). */
const TPS_CHART_ROWS = [
  { name: 'CET', value: 100_000, isCET: true },
  { name: 'FET', value: 1_000, isCET: false },
  { name: 'TAO', value: 1_000, isCET: false },
  { name: 'ASI', value: 1_000, isCET: false },
  { name: 'AGIX', value: 15, isCET: false },
  { name: 'OCEAN', value: 15, isCET: false },
] as const;

/** Scarcity chart — log scale; ASI included for parity with matrix. */
const SCARCITY_CHART_ROWS = [
  { name: 'CET', value: 9_000, isCET: true },
  { name: 'TAO', value: 21_000_000, isCET: false },
  { name: 'ASI', value: 4_600_000_000, isCET: false },
  { name: 'FET', value: 1_150_000_000, isCET: false },
  { name: 'OCEAN', value: 1_410_000_000, isCET: false },
  { name: 'AGIX', value: 2_000_000_000, isCET: false },
] as const;

const CompetitionSection = () => {
  const { t, lang } = useLanguage();
  const cs = t.competitionSection;
  const numberLocale = localeForLang(lang);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const advantageCards = [
    { icon: Coins, title: cs.advScarcityTitle, body: cs.advScarcityBody, color: 'text-solaris-gold', bg: 'bg-solaris-gold/10', border: 'border-solaris-gold/20' },
    { icon: Zap, title: cs.advTonTitle, body: cs.advTonBody, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
    { icon: Brain, title: cs.advDualAiTitle, body: cs.advDualAiBody, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    { icon: Shield, title: cs.advRwaTitle, body: cs.advRwaBody, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  ];

  const tableRowsText = [
    { label: cs.rowTotalSupply, key: 'supply' as const },
    { label: cs.rowTps, key: 'tps' as const },
    { label: cs.rowAgents, key: 'agents' as const },
    { label: cs.rowMarginalCost, key: 'marginalCost' as const },
  ];

  const tableRowsBool = [
    { label: cs.rowRwa, key: 'rwa' as const },
    { label: cs.rowDualAi, key: 'dualAi' as const },
    { label: cs.rowPowMining, key: 'mining' as const },
    { label: cs.rowAuditKyc, key: 'auditKyc' as const },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: headingRef.current, start: 'top 82%', end: 'top 55%', scrub: true },
        },
      );
      gsap.fromTo(
        tableRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: tableRef.current, start: 'top 80%', end: 'top 45%', scrub: true },
        },
      );
      const cards = cardsRef.current?.querySelectorAll('.adv-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.7,
            scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', end: 'top 30%', scrub: true },
          },
        );
      }
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="competition"
      ref={sectionRef}
      aria-label={t.sectionAria.competition}
      className="relative section-glass py-24 lg:py-32 overflow-hidden mesh-bg"
    >
      <GlowOrbs variant="gold" />

      <div className="relative z-10 section-padding-x max-w-7xl mx-auto w-full">
        <div ref={headingRef} className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-solaris-gold/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-solaris-gold" />
            </div>
            <span className="hud-label text-solaris-gold">{cs.badge}</span>
          </div>
          <h2 className="font-display font-bold text-[clamp(28px,3.5vw,48px)] text-solaris-text mb-4">
            {cs.titleLead}{' '}
            <span className="text-solaris-gold">{cs.titleAccent}</span>
          </h2>
          <p className="text-solaris-muted text-base lg:text-lg leading-relaxed">
            {cs.introLead}
            <span className="text-solaris-text font-semibold">{cs.introEmphasis}</span>
            {cs.introTail}
          </p>
        </div>

        <div ref={tableRef} className="mb-16 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="text-left p-3 text-solaris-muted text-xs font-mono uppercase tracking-widest border-b border-white/10 w-36"
                >
                  {cs.tableFeature}
                </th>
                {competitors.map((c) => (
                  <th
                    key={c.symbol}
                    scope="col"
                    className={`text-center p-3 text-xs font-bold uppercase tracking-wider border-b ${
                      c.isCET
                        ? 'text-solaris-gold border-solaris-gold/40 bg-solaris-gold/5'
                        : 'text-solaris-muted border-white/10'
                    }`}
                  >
                    <div>{c.symbol}</div>
                    <div
                      className={`text-[10px] font-normal mt-0.5 ${c.isCET ? 'text-solaris-gold/70' : 'text-solaris-muted/50'}`}
                    >
                      {c.chain}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRowsText.map(({ label, key }) => (
                <tr key={key} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <th scope="row" className="p-3 text-solaris-muted text-xs font-mono text-left font-normal">
                    {label}
                  </th>
                  {competitors.map((c) => (
                    <td key={c.symbol} className={`p-3 text-center ${c.isCET ? 'bg-solaris-gold/5' : ''}`}>
                      <TextCell value={c[key] as string} isCET={c.isCET} />
                    </td>
                  ))}
                </tr>
              ))}
              {tableRowsBool.map(({ label, key }) => (
                <tr key={key} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <th scope="row" className="p-3 text-solaris-muted text-xs font-mono text-left font-normal">
                    {label}
                  </th>
                  {competitors.map((c) => (
                    <td key={c.symbol} className={`p-3 text-center ${c.isCET ? 'bg-solaris-gold/5' : ''}`}>
                      <BoolCell value={c[key] as boolean | 'partial'} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-solaris-muted/50 text-[11px] mt-2 font-mono max-w-4xl">{cs.dataDisclaimer}</p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {advantageCards.map((adv) => {
            const Icon = adv.icon;
            return (
              <div
                key={adv.title}
                className={`adv-card bento-card p-6 border ${adv.border} group hover:scale-[1.02] transition-transform duration-200`}
              >
                <div className={`w-10 h-10 rounded-xl ${adv.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${adv.color}`} />
                </div>
                <h3 className={`font-display font-bold text-sm mb-2 ${adv.color}`}>{adv.title}</h3>
                <p className="text-solaris-muted text-xs leading-relaxed">{adv.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          <div className="bento-card p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-4 h-4 text-solaris-cyan" />
              <span className="hud-label text-solaris-cyan">{cs.chartTpsLabel}</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={[...TPS_CHART_ROWS]}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#A6A9B6', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#A6A9B6', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatTpsAxis}
                />
                <Tooltip
                  content={(props) => (
                    <CompetitionBarTooltip
                      active={props.active}
                      payload={props.payload as readonly CompetitionBarTooltipPayload[] | undefined}
                      label={props.label}
                      valueLabel={cs.tooltipTpsUnit}
                      numberLocale={numberLocale}
                    />
                  )}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {TPS_CHART_ROWS.map((entry) => (
                    <Cell key={entry.name} fill={entry.isCET ? '#F2C94C' : 'rgba(255,255,255,0.15)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-solaris-muted/60 text-[11px] mt-2 font-mono text-center">{cs.chartTpsCaption}</p>
          </div>

          <div className="bento-card p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <Coins className="w-4 h-4 text-solaris-gold" />
              <span className="hud-label text-solaris-gold">{cs.chartScarcityLabel}</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={[...SCARCITY_CHART_ROWS]}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#A6A9B6', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  scale="log"
                  domain={['auto', 'auto']}
                  tick={{ fill: '#A6A9B6', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatSupplyAxis}
                />
                <Tooltip
                  content={(props) => (
                    <CompetitionBarTooltip
                      active={props.active}
                      payload={props.payload as readonly CompetitionBarTooltipPayload[] | undefined}
                      label={props.label}
                      valueLabel={cs.tooltipSupplyUnit}
                      numberLocale={numberLocale}
                    />
                  )}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {SCARCITY_CHART_ROWS.map((entry) => (
                    <Cell key={entry.name} fill={entry.isCET ? '#F2C94C' : 'rgba(255,255,255,0.15)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-solaris-muted/60 text-[11px] mt-2 font-mono text-center">{cs.chartScarcityCaption}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionSection;
