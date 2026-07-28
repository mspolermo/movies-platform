import type { ReactNode } from 'react';

export type TAdminCrudListProps<T> = {
  items: T[];
  getKey: (item: T) => number;
  renderLabel: (item: T) => ReactNode;
  getActionLabel?: (item: T) => string;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  addLabel?: string;
  emptyText?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
};
