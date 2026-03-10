import { useEffect, useState, startTransition } from 'react';

const DEDUST_POOL_ADDRESS = 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB';
const REFRESH_INTERVAL_MS = 30_000; // 30 seconds

export interface PoolData {
  totalSupply: string;
  reserveLeft: string;
  reserveRight: string;
  lpFee: string;
  traderFee: string;
  lastUpdated: Date;
}

export const fetchPoolData = async (): Promise<PoolData> => {
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
    lastUpdated: new Date(),
  };
};

/**
 * Returns a refreshable Promise<PoolData> suitable for React 19 `use()`.
 * The hook lives OUTSIDE the Suspense boundary; the promise is passed into
 * a child component that calls `use(promise)`.
 * `startTransition` prevents the Suspense fallback from re-appearing on
 * periodic refreshes — the stale UI stays visible while the new data loads.
 */
export const usePoolDataPromise = (): Promise<PoolData> => {
  const [promise, setPromise] = useState<Promise<PoolData>>(() => fetchPoolData());

  useEffect(() => {
    const id = setInterval(() => {
      startTransition(() => {
        setPromise(fetchPoolData());
      });
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return promise;
};
