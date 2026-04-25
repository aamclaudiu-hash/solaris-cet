import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AnimatedCounter from './AnimatedCounter';

const gsapTo = vi.fn();

vi.mock('gsap', () => ({
  gsap: {
    to: gsapTo,
  },
}));

describe('AnimatedCounter', () => {
  it('renders final value immediately when prefers-reduced-motion is enabled', () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(<AnimatedCounter value={42} prefix="$" suffix=" CET" />);

    expect(screen.getByText('$42 CET')).toBeInTheDocument();
    expect(gsapTo).not.toHaveBeenCalled();

    window.matchMedia = original;
  });
});

