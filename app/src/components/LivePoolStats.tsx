import { DollarSign, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import { useLivePoolData } from '../hooks/use-live-pool-data';

function formatUsd(value: number | null, decimals = 2): string {
  if (value === null) return '—';
  if (value < 0.0001) return '< $0.0001';
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(decimals)}`;
}

const LivePoolStats = () => {
  const { priceUsd, tvlUsd, volume24hUsd, loading, error, lastUpdated } = useLivePoolData();

  // Silently omit the widget when the API is unreachable
  if (error) return null;

  return (
    <div className="mt-5 p-4 rounded-xl bg-solaris-cyan/5 border border-solaris-cyan/20">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="hud-label text-solaris-cyan text-[10px]">LIVE DEDUST POOL</span>
        {loading ? (
          <RefreshCw className="w-3 h-3 text-solaris-muted animate-spin" />
        ) : lastUpdated ? (
          <span className="text-[9px] text-solaris-muted">
            {lastUpdated.toLocaleTimeString()}
          </span>
        ) : null}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* CET Price */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="w-3 h-3 text-solaris-gold" />
            <span className="text-[9px] text-solaris-muted uppercase tracking-wide">Price</span>
          </div>
          <div className="font-mono text-sm text-solaris-gold font-semibold">
            {loading ? '…' : formatUsd(priceUsd, 6)}
          </div>
        </div>

        {/* TVL */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <BarChart3 className="w-3 h-3 text-solaris-cyan" />
            <span className="text-[9px] text-solaris-muted uppercase tracking-wide">TVL</span>
          </div>
          <div className="font-mono text-sm text-solaris-cyan font-semibold">
            {loading ? '…' : formatUsd(tvlUsd)}
          </div>
        </div>

        {/* 24 h Volume */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-[9px] text-solaris-muted uppercase tracking-wide">24 h Vol</span>
          </div>
          <div className="font-mono text-sm text-emerald-400 font-semibold">
            {loading ? '…' : formatUsd(volume24hUsd)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePoolStats;
