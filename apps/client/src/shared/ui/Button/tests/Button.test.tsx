import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../ui';

describe('Button', () => {
  it('renders label', () => {
    render(<Button>OK</Button>);
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('does not fire onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        OK
      </Button>
    );

    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fire onClick when loading', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        OK
      </Button>
    );

    const button = screen.getByRole('button', { name: 'OK' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
