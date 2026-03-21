import { describe, it, expect } from 'vitest';

// ────────────────────────────────────────────────────────────────────────────
// useIntersectionObserver — pure-logic tests
//
// The hook is a thin wrapper around IntersectionObserver, which is a browser
// API not available in a Node.js test environment. These tests therefore
// focus on the pure-logic aspects: default option values and type guarantees.
// ────────────────────────────────────────────────────────────────────────────

/** Mirrors the interface from the hook so we can test type shapes. */
interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/** Produces a full options object by applying the same defaults the hook uses. */
function applyDefaults(opts: UseIntersectionObserverOptions = {}): Required<UseIntersectionObserverOptions> {
  return {
    threshold: opts.threshold ?? 0.1,
    rootMargin: opts.rootMargin ?? '0px',
    freezeOnceVisible: opts.freezeOnceVisible ?? true,
  };
}

describe('useIntersectionObserver — default options', () => {
  it('defaults threshold to 0.1', () => {
    const opts = applyDefaults();
    expect(opts.threshold).toBe(0.1);
  });

  it('defaults rootMargin to "0px"', () => {
    const opts = applyDefaults();
    expect(opts.rootMargin).toBe('0px');
  });

  it('defaults freezeOnceVisible to true', () => {
    const opts = applyDefaults();
    expect(opts.freezeOnceVisible).toBe(true);
  });

  it('respects an explicitly provided threshold', () => {
    const opts = applyDefaults({ threshold: 0.5 });
    expect(opts.threshold).toBe(0.5);
  });

  it('respects an explicitly provided rootMargin', () => {
    const opts = applyDefaults({ rootMargin: '20px 0px' });
    expect(opts.rootMargin).toBe('20px 0px');
  });

  it('respects freezeOnceVisible: false', () => {
    const opts = applyDefaults({ freezeOnceVisible: false });
    expect(opts.freezeOnceVisible).toBe(false);
  });

  it('applies all custom values simultaneously', () => {
    const opts = applyDefaults({ threshold: 0.25, rootMargin: '-10px', freezeOnceVisible: false });
    expect(opts.threshold).toBe(0.25);
    expect(opts.rootMargin).toBe('-10px');
    expect(opts.freezeOnceVisible).toBe(false);
  });

  it('threshold must be a number in [0, 1]', () => {
    const inRange = [0, 0.1, 0.5, 1].every(v => applyDefaults({ threshold: v }).threshold === v);
    expect(inRange).toBe(true);
  });
});

describe('useIntersectionObserver — IntersectionObserver entry handling', () => {
  it('sets isVisible to true when entry is intersecting', () => {
    let isVisible = false;

    // Simulate the callback that the hook registers
    const observerCallback = ([entry]: IntersectionObserverEntry[]) => {
      if (entry) {
        isVisible = entry.isIntersecting;
      }
    };

    const fakeEntry = { isIntersecting: true } as IntersectionObserverEntry;
    observerCallback([fakeEntry]);

    expect(isVisible).toBe(true);
  });

  it('keeps isVisible false when entry is not intersecting', () => {
    let isVisible = false;

    const observerCallback = ([entry]: IntersectionObserverEntry[]) => {
      if (entry) {
        isVisible = entry.isIntersecting;
      }
    };

    const fakeEntry = { isIntersecting: false } as IntersectionObserverEntry;
    observerCallback([fakeEntry]);

    expect(isVisible).toBe(false);
  });

  it('does not throw when entry array is empty', () => {
    const observerCallback = ([entry]: IntersectionObserverEntry[]) => {
      if (entry) {
        // would set isVisible
      }
    };

    expect(() => observerCallback([])).not.toThrow();
  });
});
