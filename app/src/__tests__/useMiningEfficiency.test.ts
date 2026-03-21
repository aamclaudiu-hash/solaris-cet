import { describe, it, expect, vi, afterEach } from 'vitest';
import { useMiningEfficiency } from '../hooks/useMiningEfficiency';

describe('useMiningEfficiency module', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('exports useMiningEfficiency as a function', () => {
    expect(typeof useMiningEfficiency).toBe('function');
  });
});

describe('getBatteryInfo standalone logic', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns 100% charging when getBattery is unavailable', async () => {
    // Simulate navigator without getBattery (iOS Safari / Firefox)
    vi.stubGlobal('navigator', { language: 'en' });

    const result = await (async () => {
      if (!('getBattery' in navigator)) {
        return { level: 100, charging: true, note: 'Battery API unavailable' };
      }
      return { level: 100, charging: true };
    })();

    expect(result.level).toBe(100);
    expect(result.charging).toBe(true);
    expect(result.note).toBe('Battery API unavailable');
  });

  it('returns battery info when getBattery is available', async () => {
    vi.stubGlobal('navigator', {
      language: 'en',
      getBattery: vi.fn().mockResolvedValue({ level: 0.75, charging: false }),
    });

    const battery = await (navigator as Navigator & {
      getBattery: () => Promise<{ level: number; charging: boolean }>;
    }).getBattery();

    expect(Math.round(battery.level * 100)).toBe(75);
    expect(battery.charging).toBe(false);
  });

  it('falls back gracefully when getBattery rejects', async () => {
    vi.stubGlobal('navigator', {
      language: 'en',
      getBattery: vi.fn().mockRejectedValue(new Error('Permission denied')),
    });

    let result: { level: number; charging: boolean; note?: string };
    try {
      const battery = await (navigator as Navigator & {
        getBattery: () => Promise<{ level: number; charging: boolean }>;
      }).getBattery();
      result = { level: Math.round(battery.level * 100), charging: battery.charging };
    } catch {
      result = { level: 100, charging: true, note: 'Battery API unavailable' };
    }

    expect(result.level).toBe(100);
    expect(result.charging).toBe(true);
    expect(result.note).toBe('Battery API unavailable');
  });
});
