import { useEffect, useState, useCallback } from 'react';

const DEDUST_POOL_ADDRESS = 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB';
const REFRESH_INTERVAL_MS = 30_000; // 30 seconds

export interface PoolData {
  totalSupply: string;
  reserveLeft: string;
  reserveRight: string;
  lpFee: string;
  traderFee: string;
}

export interface LivePoolState {
  data: PoolData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const fetchPoolData = async (): Promise<PoolData> => {
  const res = await fetch(
    `https://api.dedust.io/v2/pools/${DEDUST_POOL_ADDRESS}`,
    { signal: AbortSignal.timeout(8000) }
  );
  if (!res.ok) throw new Error(`DeDust API error: ${res.status}`);
  const json = await res.json() as Record<string, unknown>;

  return {
    totalSupply: typeof json.totalSupply === 'string' ? json.totalSupply : '—',
    reserveLeft: typeof json.reserveLeft === 'string' ? json.reserveLeft : '—',
    reserveRight: typeof json.reserveRight === 'string' ? json.reserveRight : '—',
    lpFee: typeof json.lpFee === 'string' ? json.lpFee : '—',
    traderFee: typeof json.traderFee === 'string' ? json.traderFee : '—',
  };
};

export const useLivePoolData = (): LivePoolState => {
  const [state, setState] = useState<LivePoolState>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  // Stable callback using useCallback so the effect dep array is stable
  const handleData = useCallback((data: PoolData) => {
    setState({ data, loading: false, error: null, lastUpdated: new Date() });
  }, []);

  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : 'Failed to fetch pool data';
    setState(prev => ({ ...prev, loading: false, error: message }));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = () => {
      fetchPoolData()
        .then(data => { if (!cancelled) handleData(data); })
        .catch(err => { if (!cancelled) handleError(err); });
    };

    run();
    const interval = setInterval(run, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [handleData, handleError]);

  return state;
};
