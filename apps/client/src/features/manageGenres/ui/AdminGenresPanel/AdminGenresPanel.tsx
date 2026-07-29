'use client';

import type { TGenreAdminItemResponse } from '@common/types';

import type { FormEvent } from 'react';

import { useState } from 'react';

import {
  AdminCrudList,
  Button,
  filterByQuery,
  Input,
  LoadMoreSection,
  Modal,
  useAdminCrudPanel,
} from '@/shared/ui';

import styles from './AdminGenresPanel.module.scss';
import { createGenre, deleteGenre, updateGenre } from '../../api';
import { useAdminGenres } from '../../lib';

/** CRUD жанров через модалку и /admin/genres. */
export const AdminGenresPanel = () => {
  const genres = useAdminGenres();
  const panel = useAdminCrudPanel<TGenreAdminItemResponse>();
  const [nameRu, setNameRu] = useState('');
  const [nameEn, setNameEn] = useState('');

  const filtered = filterByQuery(
    genres.items,
    panel.query,
    (x, q) => x.nameRu.toLowerCase().includes(q) || x.nameEn.toLowerCase().includes(q)
  );

  const openCreate = () => {
    panel.openCreate();
    setNameRu('');
    setNameEn('');
  };

  const openEdit = (item: TGenreAdminItemResponse) => {
    panel.openEdit(item);
    setNameRu(item.nameRu);
    setNameEn(item.nameEn);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!nameRu.trim() || !nameEn.trim()) {
      panel.setError('Заполните название (RU) и (EN)');
      return;
    }

    const ok = await panel.runPending(async () => {
      if (panel.creating) {
        await createGenre({ nameRu: nameRu.trim(), nameEn: nameEn.trim() });
      } else if (panel.editing) {
        await updateGenre(panel.editing.id, { nameRu: nameRu.trim(), nameEn: nameEn.trim() });
      }
    });

    if (ok) {
      panel.closeForm();
      void genres.refetch();
    }
  };

  const handleDelete = async () => {
    if (panel.deleting == null) return;
    const ok = await panel.runPending(
      async () => {
        await deleteGenre(panel.deleting!.id);
      },
      { scope: 'delete' }
    );
    if (ok) {
      panel.cancelDelete();
      void genres.refetch();
    }
  };

  return (
    <>
      {genres.error && (
        <p className={styles.error} role="alert">
          {genres.error}
        </p>
      )}

      <LoadMoreSection
        hasMore={genres.hasMore}
        isLoading={genres.loading}
        onLoadMore={() => void genres.loadMore()}
      >
        <AdminCrudList
          addLabel="Добавить жанр"
          emptyText={genres.loading ? 'Загрузка…' : 'Нет записей'}
          getActionLabel={(item) => `${item.nameRu} / ${item.nameEn}`}
          getKey={(item) => item.id}
          items={filtered}
          renderLabel={(item) => `${item.nameRu} / ${item.nameEn}`}
          searchQuery={panel.query}
          onAdd={openCreate}
          onDelete={panel.requestDelete}
          onEdit={openEdit}
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
              onClick={panel.requestCloseForm}
            >
              Отмена
            </Button>
            <Button disabled={panel.pending} form="genre-form" type="submit">
              Сохранить
            </Button>
          </>
        }
        isOpen={panel.isFormOpen}
        title={panel.creating ? 'Новый жанр' : 'Редактировать жанр'}
        onClose={panel.requestCloseForm}
      >
        <form className={styles.fields} id="genre-form" onSubmit={handleSave}>
          {panel.error && (
            <p className={styles.error} role="alert">
              {panel.error}
            </p>
          )}
          <Input
            required
            label="Название (RU)"
            value={nameRu}
            onChange={(e) => setNameRu(e.target.value)}
          />
          <Input
            required
            label="Название (EN)"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
          />
        </form>
      </Modal>

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
        title="Удалить жанр?"
        onClose={panel.requestCancelDelete}
      >
        {panel.error && (
          <p className={styles.error} role="alert">
            {panel.error}
          </p>
        )}
        <p>
          «{panel.deleting?.nameRu} / {panel.deleting?.nameEn}» будет удалён. Если жанр привязан к
          фильмам, сервер отклонит удаление.
        </p>
      </Modal>
    </>
  );
};
