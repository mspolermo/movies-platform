import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SvgIcon } from '../ui';

describe('SvgIcon', () => {
  it('renders icon by key', () => {
    const { container } = render(<SvgIcon icon="search" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies numeric size as px width/height', () => {
    const { container } = render(<SvgIcon icon="search" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('is aria-hidden by default when decorative', () => {
    const { container } = render(<SvgIcon icon="search" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
  });

  it('exposes role=img when aria-label is set', () => {
    render(<SvgIcon aria-label="Поиск" icon="search" />);
    expect(screen.getByRole('img', { name: 'Поиск' })).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<SvgIcon className="custom-icon" icon="search" />);
    expect(container.querySelector('svg')).toHaveClass('custom-icon');
  });
});
