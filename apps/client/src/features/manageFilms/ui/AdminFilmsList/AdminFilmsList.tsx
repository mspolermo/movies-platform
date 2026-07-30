'use client';

import type { TAdminFilmItemResponse } from '@common/types';

import { useRouter } from 'next/navigation';

import { AdminCrudList, Button, LoadMoreSection, Modal, useAdminCrudPanel } from '@/shared/ui';

import styles from './AdminFilmsList.module.scss';
import { deleteFilm } from '../../api';
import { useAdminFilms } from '../../lib';

export const AdminFilmsList = () => {
  const router = useRouter();
  const panel = useAdminCrudPanel<TAdminFilmItemResponse>();
  const films = useAdminFilms(panel.query);

  const handleDelete = async () => {
    if (panel.deleting == null) return;
    const ok = await panel.runPending(
      async () => {
        await deleteFilm(panel.deleting!.id);
      },
      { scope: 'delete' }
    );
    if (ok) {
      panel.cancelDelete();
      void films.refetch();
    }
  };

  return (
    <>
      {films.error && (
        <p className={styles.error} role="alert">
          {films.error}
        </p>
      )}

      <LoadMoreSection
        hasMore={films.hasMore}
        isLoading={films.loading}
        onLoadMore={() => void films.loadMore()}
      >
        <AdminCrudList
          addLabel="Создать фильм"
          emptyText={films.loading ? 'Загрузка…' : 'Фильмы не найдены'}
          getActionLabel={(item) => item.filmNameRu}
          getKey={(item) => item.id}
          items={films.items}
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
      </LoadMoreSection>

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
        <p>
          «{panel.deleting?.filmNameRu}» будет удалён безвозвратно вместе со связями и
          комментариями.
        </p>
      </Modal>
    </>
  );
};
