import { Activity, RefreshCw, ExternalLink } from 'lucide-react';
import { useLivePoolData } from '../hooks/useLivePoolData';

const DEDUST_POOL_URL =
  'https://dedust.io/pools/EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB';

const formatNano = (raw: string): string => {
  const num = Number(raw);
  if (isNaN(num)) return raw;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)} TON`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return `${num.toFixed(2)}`;
};

const LivePoolStats = () => {
  const { data, loading, error, lastUpdated } = useLivePoolData();

  const stats = data
    ? [
        { label: 'TON Reserve', value: formatNano(data.reserveLeft), color: 'cyan' },
        { label: 'CET Reserve', value: formatNano(data.reserveRight), color: 'gold' },
        { label: 'LP Fee', value: data.lpFee !== '—' ? `${(Number(data.lpFee) / 10).toFixed(2)}%` : '—', color: 'emerald' },
        { label: 'LP Supply', value: formatNano(data.totalSupply), color: 'purple' },
      ]
    : [];

  return (
    <div className="glass-card p-5 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-solaris-cyan/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-solaris-cyan" />
          </div>
          <span className="hud-label text-solaris-cyan">Live DeDust Pool</span>
          {!loading && !error && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <RefreshCw className="w-3.5 h-3.5 text-solaris-muted animate-spin" />
          )}
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
      </div>

      {/* Stats grid */}
      {error ? (
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
      ) : (
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
                {loading && !data ? (
                  <span className="animate-pulse">—</span>
                ) : (
                  stat.value
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Last updated */}
      {lastUpdated && !error && (
        <p className="text-[10px] text-solaris-muted mt-3 text-right font-mono">
          Updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default LivePoolStats;
