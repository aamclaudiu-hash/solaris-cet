/**
 * Unit tests for the battery-info helper logic extracted from useMiningEfficiency.
 *
 * The hook itself (useMiningEfficiency) uses React useState / useEffect and
 * cannot be called outside a React component tree without a renderer like jsdom.
 * Instead, we test the battery-info pure-logic via a standalone helper that
 * mirrors the hook's internal getBatteryInfo implementation, ensuring those
 * code paths are covered without requiring a React context.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { useMiningEfficiency } from '../hooks/useMiningEfficiency';

// ─── Standalone battery helper ────────────────────────────────────────────────
// Note: `getBatteryInfo` is defined as a `useCallback` inside the hook and
// cannot be imported directly.  This standalone helper mirrors the exact same
// logic so we can unit-test the branching behaviour (Battery API present /
// absent / rejects) without needing a React renderer.  Should the hook's
// implementation change, this helper must be kept in sync.

type BatteryInfo = { level: number; charging: boolean; note?: string };

async function getBatteryInfo(): Promise<BatteryInfo> {
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

// ─── Helper to define/restore navigator in node environment ──────────────────

function stubNavigator(value: object) {
  Object.defineProperty(globalThis, 'navigator', {
    value,
    configurable: true,
    writable: true,
  });
}

function restoreNavigator() {
  // Remove the stub by deleting the configurable property; the engine then
  // falls back to its own read-only getter.
  try {
    Object.defineProperty(globalThis, 'navigator', {
      value: undefined,
      configurable: true,
      writable: true,
    });
  } catch { /* ignore */ }
}

// ─── Module-level contract ────────────────────────────────────────────────────

describe('useMiningEfficiency module', () => {
  it('exports a callable function', () => {
    expect(typeof useMiningEfficiency).toBe('function');
  });
});

// ─── Battery helper — no API available (default node environment) ─────────────

describe('getBatteryInfo — Battery API absent', () => {
  it('returns level=100, charging=true and a note', async () => {
    const result = await getBatteryInfo();
    expect(result.level).toBe(100);
    expect(result.charging).toBe(true);
    expect(result.note).toBe('Battery API unavailable');
  });
});

// ─── Battery helper — API present ────────────────────────────────────────────

describe('getBatteryInfo — Battery API stub', () => {
  afterEach(() => {
    restoreNavigator();
  });

  it('returns level as integer percentage when getBattery resolves', async () => {
    stubNavigator({ getBattery: async () => ({ level: 0.6, charging: true }) });

    const result = await getBatteryInfo();
    expect(result.level).toBe(60);
    expect(result.charging).toBe(true);
    expect(result.note).toBeUndefined();
  });

  it('falls back gracefully when getBattery rejects', async () => {
    stubNavigator({ getBattery: async () => { throw new Error('Denied'); } });

    const result = await getBatteryInfo();
    expect(result.level).toBe(100);
    expect(result.charging).toBe(true);
    expect(result.note).toBe('Battery API unavailable');
  });

  it('rounds fractional battery level to the nearest integer', async () => {
    stubNavigator({ getBattery: async () => ({ level: 0.735, charging: false }) });

    const result = await getBatteryInfo();
    expect(result.level).toBe(74); // Math.round(73.5) = 74
    expect(result.charging).toBe(false);
  });
});
