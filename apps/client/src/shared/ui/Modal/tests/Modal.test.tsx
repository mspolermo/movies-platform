import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from '../ui';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        content
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('portals dialog content when open', () => {
    render(
      <Modal isOpen title="Заголовок" onClose={() => {}}>
        тело
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Заголовок')).toBeInTheDocument();
    expect(screen.getByText('тело')).toBeInTheDocument();
  });

  it('calls onClose on Escape', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        x
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when closeOnEsc is false', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen closeOnEsc={false} onClose={onClose}>
        x
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose from close button', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen title="T" onClose={onClose}>
        x
      </Modal>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('focuses dialog panel when open', () => {
    render(
      <Modal isOpen title="Focus" onClose={() => {}}>
        x
      </Modal>
    );

    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('cycles Tab from last focusable to first', () => {
    render(
      <Modal isOpen title="T" onClose={() => {}}>
        <button type="button">A</button>
        <button type="button">B</button>
      </Modal>
    );

    const closeBtn = screen.getByRole('button', { name: 'Закрыть' });
    const last = screen.getByRole('button', { name: 'B' });

    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(closeBtn).toHaveFocus();
  });

  it('restores focus to opener when closed', () => {
    const opener = document.createElement('button');
    opener.type = 'button';
    opener.textContent = 'open';
    document.body.appendChild(opener);
    opener.focus();

    const { rerender } = render(
      <Modal isOpen onClose={() => {}}>
        x
      </Modal>
    );

    expect(screen.getByRole('dialog')).toHaveFocus();

    rerender(
      <Modal isOpen={false} onClose={() => {}}>
        x
      </Modal>
    );

    expect(opener).toHaveFocus();
    opener.remove();
  });
});
