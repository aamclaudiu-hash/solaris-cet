import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useNearScreen } from '../hooks/useNearScreen';

describe('useNearScreen module', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      class MockIO {
        callback: IntersectionObserverCallback;
        constructor(cb: IntersectionObserverCallback) {
          this.callback = cb;
        }
        observe() {}
        disconnect() {}
        unobserve() {}
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exports useNearScreen as a function', () => {
    expect(typeof useNearScreen).toBe('function');
  });
});
