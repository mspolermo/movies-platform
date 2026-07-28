import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AdminCrudList } from '../ui';

type TItem = { id: number; label: string };

describe('AdminCrudList', () => {
  it('renders items and triggers callbacks', () => {
    const onAdd = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const items: TItem[] = [{ id: 1, label: 'Alpha' }];

    render(
      <AdminCrudList
        addLabel="Добавить"
        getActionLabel={(item) => item.label}
        getKey={(item) => item.id}
        items={items}
        renderLabel={(item) => item.label}
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    screen.getByRole('button', { name: 'Добавить' }).click();
    expect(onAdd).toHaveBeenCalledTimes(1);
    screen.getByRole('button', { name: 'Изменить: Alpha' }).click();
    expect(onEdit).toHaveBeenCalledWith({ id: 1, label: 'Alpha' });
    screen.getByRole('button', { name: 'Удалить: Alpha' }).click();
    expect(onDelete).toHaveBeenCalledWith({ id: 1, label: 'Alpha' });
  });

  it('shows empty text', () => {
    const items: TItem[] = [];

    render(
      <AdminCrudList
        emptyText="Пусто"
        getKey={(item) => item.id}
        items={items}
        renderLabel={(item) => item.label}
        onAdd={() => undefined}
        onDelete={() => undefined}
        onEdit={() => undefined}
      />
    );
    expect(screen.getByText('Пусто')).toBeInTheDocument();
  });
});
