'use client';

import type { TAdminFilmItemResponse } from '@common/types';

import { useRouter } from 'next/navigation';

import { AdminCrudList, Button, filterByQuery, Modal, useAdminCrudPanel } from '@/shared/ui';

import styles from './AdminFilmsList.module.scss';
import { deleteFilmStub } from '../../api';
import { useAdminFilms } from '../../lib';

/** Список фильмов админки: поиск, переход в форму, подтверждение удаления. */
export const AdminFilmsList = () => {
  const router = useRouter();
  const films = useAdminFilms();
  const panel = useAdminCrudPanel<TAdminFilmItemResponse>();

  const filtered = filterByQuery(
    films,
    panel.query,
    (f, q) =>
      f.filmNameRu.toLowerCase().includes(q) || (f.filmNameEn?.toLowerCase().includes(q) ?? false)
  );

  const handleDelete = async () => {
    if (panel.deleting == null) return;
    const ok = await panel.runPending(
      async () => {
        await deleteFilmStub(panel.deleting!.id);
      },
      { scope: 'delete' }
    );
    if (ok) panel.cancelDelete();
  };

  return (
    <>
      <AdminCrudList
        addLabel="Создать фильм"
        emptyText="Фильмы не найдены"
        getActionLabel={(item) => item.filmNameRu}
        getKey={(item) => item.id}
        items={filtered}
        renderLabel={(item) => (
          <span className={styles.label}>
            <strong>{item.filmNameRu}</strong>
            {item.filmNameEn ? ` / ${item.filmNameEn}` : ''}
            {item.year != null ? ` (${item.year})` : ''}
          </span>
        )}
        searchPlaceholder="Поиск по названию"
        searchQuery={panel.query}
        onAdd={() => router.push('/admin/films/new')}
        onDelete={panel.requestDelete}
        onEdit={(item) => router.push(`/admin/films/${item.id}`)}
        onSearchChange={panel.setQuery}
      />

      <Modal
        footer={
          <>
            <Button
              disabled={panel.pending}
              type="button"
              variant="outline"
              onClick={panel.requestCancelDelete}
            >
              Отмена
            </Button>
            <Button disabled={panel.pending} type="button" variant="red" onClick={handleDelete}>
              Удалить
            </Button>
          </>
        }
        isOpen={panel.deleting != null}
        title="Удалить фильм?"
        onClose={panel.requestCancelDelete}
      >
        {panel.error && (
          <p className={styles.error} role="alert">
            {panel.error}
          </p>
        )}
        <p>«{panel.deleting?.filmNameRu}» будет удалён из stub-хранилища (без запроса к API).</p>
      </Modal>
    </>
  );
};
