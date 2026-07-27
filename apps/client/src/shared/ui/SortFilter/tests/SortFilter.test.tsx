import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SortFilter } from '../ui';

describe('SortFilter', () => {
  it('shows current sort label', () => {
    render(<SortFilter selectedSort="rating" onUpdateSort={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('По рейтингу');
  });

  it('opens dropdown and selects option', async () => {
    const user = userEvent.setup();
    const onUpdateSort = vi.fn();

    render(<SortFilter selectedSort="rating" onUpdateSort={onUpdateSort} />);

    await user.click(screen.getByRole('button', { name: /По рейтингу/i }));
    expect(screen.getByText('Сортировка')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'По алфавиту' }));
    expect(onUpdateSort).toHaveBeenCalledWith('alphabet');
    expect(screen.queryByText('Сортировка')).not.toBeInTheDocument();
  });

  it('closes dropdown on overlay click', () => {
    const { container } = render(<SortFilter selectedSort="rating" onUpdateSort={() => {}} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Сортировка')).toBeInTheDocument();

    const overlay = container.querySelector('[class*="overlay"]');
    expect(overlay).toBeTruthy();
    fireEvent.click(overlay as HTMLElement);
    expect(screen.queryByText('Сортировка')).not.toBeInTheDocument();
  });
});
