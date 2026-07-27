import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Card } from '../ui';

describe('Card', () => {
  it('renders title', () => {
    render(<Card title="Test" type="small" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders role when provided', () => {
    render(<Card role="Актёр" title="Name" type="small" />);
    expect(screen.getByText('Актёр')).toBeInTheDocument();
  });

  it('calls onClick', () => {
    const onClick = vi.fn();
    render(<Card title="Click me" type="small" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates on Enter when interactive', () => {
    const onClick = vi.fn();
    render(<Card title="Key" type="big" onClick={onClick} />);
    const card = screen.getByRole('button');
    card.focus();
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
