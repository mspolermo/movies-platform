import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Tooltip } from '../ui';

describe('Tooltip', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders trigger', () => {
    render(
      <Tooltip content="Tip">
        <button type="button">i</button>
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: 'i' })).toBeInTheDocument();
  });

  it('shows content after hover delay with tooltip role', async () => {
    vi.useFakeTimers();

    const { container } = render(
      <Tooltip content="Tip text" delay={300}>
        <button type="button">i</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(container.firstChild as HTMLElement);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(screen.getByRole('tooltip')).toHaveTextContent('Tip text');
    expect(container.firstChild).toHaveAttribute('aria-describedby');
  });

  it('does not show content when disabled', async () => {
    vi.useFakeTimers();

    const { container } = render(
      <Tooltip disabled content="Hidden" delay={0}>
        <button type="button">i</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(container.firstChild as HTMLElement);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
