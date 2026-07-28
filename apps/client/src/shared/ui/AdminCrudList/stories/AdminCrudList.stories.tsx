import type { TAdminCrudListProps } from '../model';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AdminCrudList } from '../ui';

type TItem = { id: number; label: string };

const AdminCrudListDemo = (props: TAdminCrudListProps<TItem>) => <AdminCrudList {...props} />;

const meta = {
  title: 'shared/ui/AdminCrudList',
  component: AdminCrudListDemo,
} satisfies Meta<typeof AdminCrudListDemo>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  args: {
    addLabel: 'Добавить',
    emptyText: 'Нет записей',
    getKey: (item) => item.id,
    items: [
      { id: 1, label: 'Боевик' },
      { id: 2, label: 'Драма' },
    ],
    renderLabel: (item) => item.label,
    onAdd: () => undefined,
    onDelete: () => undefined,
    onEdit: () => undefined,
    searchQuery: '',
    onSearchChange: () => undefined,
    searchPlaceholder: 'Поиск…',
  },
};
