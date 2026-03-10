import { use, Suspense } from 'react';
import { Activity, RefreshCw, ExternalLink } from 'lucide-react';
import { usePoolDataPromise, type PoolData } from '../hooks/useLivePoolData';

const DEDUST_POOL_URL =
  'https://dedust.io/pools/EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB';

const formatNanoValue = (raw: string, unit: string): string => {
  const num = Number(raw);
  if (isNaN(num)) return raw;
  // Values are in nano units (1e-9); divide by 1e9 to get whole units
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)} ${unit}`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return `${num.toFixed(2)}`;
};

const formatNano = (raw: string): string => formatNanoValue(raw, 'TON');
const formatNanoCet = (raw: string): string => formatNanoValue(raw, 'CET');

/* ── Skeleton shown while the initial promise resolves ── */
const PoolStatsSkeleton = () => (
  <div className="glass-card p-5 lg:p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-solaris-cyan/10 flex items-center justify-center">
          <Activity className="w-4 h-4 text-solaris-cyan" />
        </div>
        <span className="hud-label text-solaris-cyan">Live DeDust Pool</span>
      </div>
      <RefreshCw className="w-3.5 h-3.5 text-solaris-muted animate-spin" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {['TON Reserve', 'CET Reserve', 'LP Fee', 'LP Supply'].map((label) => (
        <div key={label} className="p-3 rounded-lg bg-white/5">
          <div className="text-solaris-muted text-[11px] mb-1">{label}</div>
          <div className="font-mono font-semibold text-sm animate-pulse text-solaris-muted">—</div>
        </div>
      ))}
    </div>
  </div>
);

/* ── Error fallback shown when the pool is unreachable ── */
export const PoolStatsError = () => (
  <div className="glass-card p-5 lg:p-6">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-solaris-cyan/10 flex items-center justify-center">
        <Activity className="w-4 h-4 text-solaris-cyan" />
      </div>
      <span className="hud-label text-solaris-cyan">Live DeDust Pool</span>
    </div>
    <p className="text-solaris-muted text-xs text-center py-4">
      Live data temporarily unavailable.{' '}
      <a
        href={DEDUST_POOL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-solaris-gold hover:underline"
      >
        View on DeDust →
      </a>
    </p>
  </div>
);

/* ── Inner component — suspended until the promise resolves ── */
const PoolStatsContent = ({ promise }: { promise: Promise<PoolData> }) => {
  const data = use(promise);

  const stats = [
    { label: 'TON Reserve', value: formatNano(data.reserveLeft), color: 'cyan' },
    { label: 'CET Reserve', value: formatNanoCet(data.reserveRight), color: 'gold' },
    { label: 'LP Fee', value: data.lpFee !== '—' ? `${(Number(data.lpFee) / 10).toFixed(2)}%` : '—', color: 'emerald' },
    { label: 'LP Supply', value: formatNano(data.totalSupply), color: 'purple' },
  ];

  return (
    <div className="glass-card p-5 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-solaris-cyan/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-solaris-cyan" />
          </div>
          <span className="hud-label text-solaris-cyan">Live DeDust Pool</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
          </span>
        </div>
        <a
          href={DEDUST_POOL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-solaris-muted hover:text-solaris-gold transition-colors"
        >
          DeDust
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="p-3 rounded-lg bg-white/5">
            <div className="text-solaris-muted text-[11px] mb-1">{stat.label}</div>
            <div
              className={`font-mono font-semibold text-sm ${
                stat.color === 'gold'
                  ? 'text-solaris-gold'
                  : stat.color === 'cyan'
                  ? 'text-solaris-cyan'
                  : stat.color === 'emerald'
                  ? 'text-emerald-400'
                  : 'text-purple-400'
              }`}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Last updated */}
      <p className="text-[10px] text-solaris-muted mt-3 text-right font-mono">
        Updated {data.lastUpdated.toLocaleTimeString()}
      </p>
    </div>
  );
};

/* ── Public component — manages the refreshable promise, wraps Suspense ── */
const LivePoolStats = () => {
  const promise = usePoolDataPromise();

  return (
    <Suspense fallback={<PoolStatsSkeleton />}>
      <PoolStatsContent promise={promise} />
    </Suspense>
  );
};

export default LivePoolStats;
