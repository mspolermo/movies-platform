import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Select } from '../ui';

const OPTIONS = [
  { value: 'a', label: 'Актёр' },
  { value: 'b', label: 'Режиссёр' },
];

describe('Select', () => {
  it('single: меняет значение', () => {
    const onChange = vi.fn();
    render(<Select label="Роль" options={OPTIONS} value="a" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Роль'), { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('multiple: тоглит чекбоксы', () => {
    const onChange = vi.fn();
    render(
      <Select multiple label="Профессии" options={OPTIONS} value={['a']} onChange={onChange} />
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Режиссёр' }));
    expect(onChange).toHaveBeenCalledWith(['a', 'b']);
  });
});
