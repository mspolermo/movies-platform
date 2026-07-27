import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HorizontalCarousel } from '../ui';

describe('HorizontalCarousel', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );

    vi.stubGlobal(
      'ResizeObserver',
      vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }))
    );
  });

  it('renders children and nav arrows', () => {
    render(
      <HorizontalCarousel arrows="always">
        <div>item</div>
      </HorizontalCarousel>
    );

    expect(screen.getByText('item')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Прокрутить влево' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Прокрутить вправо' })).toBeInTheDocument();
  });
});
