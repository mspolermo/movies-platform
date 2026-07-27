import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Logo } from '../ui';

describe('Logo', () => {
  it('exposes brand as img by default', () => {
    render(<Logo />);
    expect(screen.getByRole('img', { name: 'Movies' })).toBeInTheDocument();
  });

  it('is keyboard-activatable when onClick is set', () => {
    const onClick = vi.fn();
    render(<Logo onClick={onClick} />);

    const logo = screen.getByRole('button', { name: 'Movies' });
    fireEvent.keyDown(logo, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(logo, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('can be decorative via aria-hidden', () => {
    const { container } = render(<Logo aria-hidden />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
