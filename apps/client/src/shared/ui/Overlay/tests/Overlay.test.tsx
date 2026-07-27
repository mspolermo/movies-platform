import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Overlay } from '../ui';

describe('Overlay', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <Overlay isOpen={false} onClose={() => {}}>
        x
      </Overlay>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders children when open', () => {
    render(
      <Overlay isOpen onClose={() => {}}>
        overlay-body
      </Overlay>
    );
    expect(screen.getByText('overlay-body')).toBeInTheDocument();
  });

  it('calls onClose on Escape', () => {
    const onClose = vi.fn();
    render(
      <Overlay isOpen onClose={onClose}>
        x
      </Overlay>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll while open and restores on unmount', () => {
    const { unmount } = render(
      <Overlay isOpen onClose={() => {}}>
        x
      </Overlay>
    );

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('calls onClose on backdrop click', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Overlay isOpen onClose={onClose}>
        <span>inner</span>
      </Overlay>
    );

    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
