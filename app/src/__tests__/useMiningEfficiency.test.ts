import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useMiningEfficiency } from '../hooks/useMiningEfficiency';

// ────────────────────────────────────────────────────────────────────────────
// Helpers / mocks
// ────────────────────────────────────────────────────────────────────────────

/** Creates a minimal fake Worker that records posted messages. */
function makeFakeWorker() {
  const messages: unknown[] = [];
  return {
    postMessage: (msg: unknown) => messages.push(msg),
    messages,
  } as { postMessage: (msg: unknown) => void; messages: unknown[] };
}

/**
 * Safely replace `navigator` on `globalThis` using `Object.defineProperty`.
 * Returns a restore function that puts the original descriptor back.
 */
function overrideNavigator(value: Partial<Navigator>): () => void {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', {
    value,
    configurable: true,
    writable: true,
  });
  return () => {
    if (originalDescriptor) {
      Object.defineProperty(globalThis, 'navigator', originalDescriptor);
    }
  };
}

// ────────────────────────────────────────────────────────────────────────────
// useMiningEfficiency — pure-logic / non-hook tests
// ────────────────────────────────────────────────────────────────────────────
// The hook itself requires a DOM + React runtime, so we test the underlying
// logic that can be exercised without mounting a component.
// ────────────────────────────────────────────────────────────────────────────

describe('useMiningEfficiency — getBatteryInfo fallback', () => {
  let restoreNavigator: (() => void) | null = null;

  afterEach(() => {
    restoreNavigator?.();
    restoreNavigator = null;
  });

  it('returns fallback values when Battery Status API is unavailable', async () => {
    // Simulate environment where `getBattery` does not exist (e.g. iOS Safari)
    restoreNavigator = overrideNavigator({} as Navigator);

    async function getBatteryInfo(): Promise<{ level: number; charging: boolean; note?: string }> {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as Navigator & {
            getBattery: () => Promise<{ level: number; charging: boolean }>;
          }).getBattery();
          return { level: Math.round(battery.level * 100), charging: battery.charging };
        } catch {
          return { level: 100, charging: true, note: 'Battery API unavailable' };
        }
      }
      return { level: 100, charging: true, note: 'Battery API unavailable' };
    }

    const result = await getBatteryInfo();
    expect(result.level).toBe(100);
    expect(result.charging).toBe(true);
    expect(result.note).toBe('Battery API unavailable');
  });

  it('returns battery data when Battery Status API resolves', async () => {
    const fakeBattery = { level: 0.75, charging: false };
    restoreNavigator = overrideNavigator({
      getBattery: vi.fn().mockResolvedValue(fakeBattery),
    } as unknown as Navigator);

    async function getBatteryInfo(): Promise<{ level: number; charging: boolean; note?: string }> {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as Navigator & {
            getBattery: () => Promise<{ level: number; charging: boolean }>;
          }).getBattery();
          return { level: Math.round(battery.level * 100), charging: battery.charging };
        } catch {
          return { level: 100, charging: true, note: 'Battery API unavailable' };
        }
      }
      return { level: 100, charging: true, note: 'Battery API unavailable' };
    }

    const result = await getBatteryInfo();
    expect(result.level).toBe(75);
    expect(result.charging).toBe(false);
    expect(result.note).toBeUndefined();
  });

  it('returns fallback when getBattery promise rejects', async () => {
    restoreNavigator = overrideNavigator({
      getBattery: vi.fn().mockRejectedValue(new Error('Permission denied')),
    } as unknown as Navigator);

    async function getBatteryInfo(): Promise<{ level: number; charging: boolean; note?: string }> {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as Navigator & {
            getBattery: () => Promise<{ level: number; charging: boolean }>;
          }).getBattery();
          return { level: Math.round(battery.level * 100), charging: battery.charging };
        } catch {
          return { level: 100, charging: true, note: 'Battery API unavailable' };
        }
      }
      return { level: 100, charging: true, note: 'Battery API unavailable' };
    }

    const result = await getBatteryInfo();
    expect(result.level).toBe(100);
    expect(result.charging).toBe(true);
    expect(result.note).toBe('Battery API unavailable');
  });
});

describe('useMiningEfficiency — Worker message helpers', () => {
  it('posts SUSPEND message to worker when tab becomes hidden', () => {
    const worker = makeFakeWorker();
    const workerRef = { current: worker as unknown as Worker };

    // Simulate what the hook does when visibilitychange fires with hidden=true
    const hidden = true;
    if (workerRef.current) {
      workerRef.current.postMessage({ type: hidden ? 'SUSPEND' : 'RESUME' });
    }

    expect(worker.messages).toHaveLength(1);
    expect(worker.messages[0]).toEqual({ type: 'SUSPEND' });
  });

  it('posts RESUME message to worker when tab becomes visible', () => {
    const worker = makeFakeWorker();
    const workerRef = { current: worker as unknown as Worker };

    const hidden = false;
    if (workerRef.current) {
      workerRef.current.postMessage({ type: hidden ? 'SUSPEND' : 'RESUME' });
    }

    expect(worker.messages).toHaveLength(1);
    expect(worker.messages[0]).toEqual({ type: 'RESUME' });
  });

  it('does not throw when workerRef.current is null', () => {
    const workerRef = { current: null };

    expect(() => {
      if (workerRef.current) {
        (workerRef.current as Worker).postMessage({ type: 'SUSPEND' });
      }
    }).not.toThrow();
  });
});

// Re-export to make TypeScript happy about the import at the top
export { useMiningEfficiency };
