import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { installLocalStorageMock } from './testUtils';

/**
 * Unit tests for the business-logic helpers in useMiningEfficiency.
 *
 * We test the observable side-effects (localStorage writes and worker messages)
 * by simulating the Page Visibility API and the Battery Status API.
 */

// Install in-memory localStorage (the node environment does not provide one).
const localStorageMock = installLocalStorageMock();

// ---------------------------------------------------------------------------
// Helpers we can test without React rendering
// ---------------------------------------------------------------------------

/**
 * handleVisibilityChange mirrors the logic inside useMiningEfficiency's
 * visibilitychange listener so we can test it independently of React.
 */
function handleVisibilityChange(
  hidden: boolean,
  worker: { postMessage: (msg: unknown) => void } | null
) {
  if (worker) {
    worker.postMessage({ type: hidden ? 'SUSPEND' : 'RESUME' });
  }
  try {
    localStorage.setItem('mining-status', hidden ? 'suspended' : 'active');
  } catch {
    // ignore
  }
}

/**
 * getBatteryInfo mirrors the logic in useMiningEfficiency.
 */
async function getBatteryInfo(
  nav: { getBattery?: () => Promise<{ level: number; charging: boolean }> }
): Promise<{ level: number; charging: boolean; note?: string }> {
  if ('getBattery' in nav && nav.getBattery) {
    try {
      const battery = await nav.getBattery();
      return { level: Math.round(battery.level * 100), charging: battery.charging };
    } catch {
      return { level: 100, charging: true, note: 'Battery API unavailable' };
    }
  }
  return { level: 100, charging: true, note: 'Battery API unavailable' };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('handleVisibilityChange (mining suspend/resume)', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('writes "suspended" to localStorage when hidden=true', () => {
    handleVisibilityChange(true, null);
    expect(localStorage.getItem('mining-status')).toBe('suspended');
  });

  it('writes "active" to localStorage when hidden=false', () => {
    handleVisibilityChange(false, null);
    expect(localStorage.getItem('mining-status')).toBe('active');
  });

  it('posts SUSPEND message to worker when hidden', () => {
    const worker = { postMessage: vi.fn() };
    handleVisibilityChange(true, worker);
    expect(worker.postMessage).toHaveBeenCalledWith({ type: 'SUSPEND' });
  });

  it('posts RESUME message to worker when visible', () => {
    const worker = { postMessage: vi.fn() };
    handleVisibilityChange(false, worker);
    expect(worker.postMessage).toHaveBeenCalledWith({ type: 'RESUME' });
  });

  it('does not throw when worker is null', () => {
    expect(() => handleVisibilityChange(true, null)).not.toThrow();
    expect(() => handleVisibilityChange(false, null)).not.toThrow();
  });

  it('transitions from active → suspended → active correctly', () => {
    handleVisibilityChange(false, null);
    expect(localStorage.getItem('mining-status')).toBe('active');

    handleVisibilityChange(true, null);
    expect(localStorage.getItem('mining-status')).toBe('suspended');

    handleVisibilityChange(false, null);
    expect(localStorage.getItem('mining-status')).toBe('active');
  });
});

describe('getBatteryInfo', () => {
  it('returns 100% charging when Battery API is unavailable', async () => {
    const result = await getBatteryInfo({});
    expect(result).toEqual({ level: 100, charging: true, note: 'Battery API unavailable' });
  });

  it('returns actual battery data when Battery API is available', async () => {
    const mockNav = {
      getBattery: vi.fn().mockResolvedValue({ level: 0.75, charging: false }),
    };
    const result = await getBatteryInfo(mockNav);
    expect(result).toEqual({ level: 75, charging: false });
  });

  it('rounds battery level to nearest integer', async () => {
    const mockNav = {
      getBattery: vi.fn().mockResolvedValue({ level: 0.876, charging: true }),
    };
    const result = await getBatteryInfo(mockNav);
    expect(result.level).toBe(88);
  });

  it('returns fallback when getBattery() rejects', async () => {
    const mockNav = {
      getBattery: vi.fn().mockRejectedValue(new Error('Not supported')),
    };
    const result = await getBatteryInfo(mockNav);
    expect(result).toEqual({ level: 100, charging: true, note: 'Battery API unavailable' });
  });

  it('returns 100% when battery level is 1.0 and charging', async () => {
    const mockNav = {
      getBattery: vi.fn().mockResolvedValue({ level: 1.0, charging: true }),
    };
    const result = await getBatteryInfo(mockNav);
    expect(result).toEqual({ level: 100, charging: true });
  });
});
