'use client';

import type { TAdminCrudListProps } from '../model';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

import styles from './AdminCrudList.module.scss';

/** Список и панель действий «Добавить/Изменить/Удалить» для админского CRUD. */
export const AdminCrudList = <T,>({
  items,
  getKey,
  renderLabel,
  getActionLabel,
  onAdd,
  onEdit,
  onDelete,
  addLabel = 'Добавить',
  emptyText = 'Нет записей',
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Поиск…',
}: TAdminCrudListProps<T>) => (
  <div className={styles.root}>
    <div className={styles.toolbar}>
      {onSearchChange ? (
        <div className={styles.search}>
          <Input
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            size="small"
            value={searchQuery ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      ) : null}
      <Button size="small" type="button" onClick={onAdd}>
        {addLabel}
      </Button>
    </div>

    {items.length === 0 ? (
      <p className={styles.empty}>{emptyText}</p>
    ) : (
      <ul className={styles.list}>
        {items.map((item) => {
          const actionLabel = getActionLabel?.(item) ?? `id ${getKey(item)}`;

          return (
            <li key={getKey(item)} className={styles.row}>
              <div className={styles.label}>{renderLabel(item)}</div>
              <div className={styles.actions}>
                <Button
                  aria-label={`Изменить: ${actionLabel}`}
                  size="small"
                  type="button"
                  variant="outline"
                  onClick={() => onEdit(item)}
                >
                  Изменить
                </Button>
                <Button
                  aria-label={`Удалить: ${actionLabel}`}
                  size="small"
                  type="button"
                  variant="red"
                  onClick={() => onDelete(item)}
                >
                  Удалить
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);
