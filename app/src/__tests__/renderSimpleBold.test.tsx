import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderSimpleBold } from '@/lib/renderSimpleBold';

describe('renderSimpleBold', () => {
  it('renders plain text without strong elements', () => {
    render(<p data-testid="wrap">{renderSimpleBold('no bold here')}</p>);
    expect(screen.getByTestId('wrap')).toHaveTextContent('no bold here');
    expect(screen.getByTestId('wrap').querySelector('strong')).toBeNull();
  });

  it('wraps odd segments in strong after ** split', () => {
    render(<p data-testid="wrap">{renderSimpleBold('a **inner** tail')}</p>);
    expect(screen.getByText('a ')).toBeInTheDocument();
    const strong = screen.getByRole('generic', { hidden: true }).querySelector('strong');
    // strong is inside wrap
    expect(screen.getByTestId('wrap').querySelector('strong')).toHaveTextContent('inner');
    expect(screen.getByTestId('wrap')).toHaveTextContent('tail');
  });

  it('handles identical bold segments without React key warnings (smoke)', () => {
    const { container } = render(
      <p data-testid="wrap">{renderSimpleBold('**same** and **same** end')}</p>,
    );
    const strongs = container.querySelectorAll('strong');
    expect(strongs).toHaveLength(2);
    strongs.forEach((el) => expect(el).toHaveTextContent('same'));
    expect(screen.getByTestId('wrap')).toHaveTextContent('and');
    expect(screen.getByTestId('wrap')).toHaveTextContent('end');
  });

  it('applies custom strong className', () => {
    const { container } = render(
      <span data-testid="wrap">{renderSimpleBold('**x**', 'font-bold text-red-500')}</span>,
    );
    const s = container.querySelector('strong');
    expect(s).toHaveClass('font-bold', 'text-red-500');
    expect(s).toHaveTextContent('x');
  });
});
