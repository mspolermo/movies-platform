import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '../ui';

describe('Input', () => {
  it('renders labeled field', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('calls onClear when clearable and has value', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<Input clearable label="Name" value="x" onChange={() => {}} onClear={onClear} />);
    await user.click(screen.getByRole('button', { name: 'Очистить' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
