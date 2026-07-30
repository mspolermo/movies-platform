'use client';

import type { TAdminProfessionItemResponse } from '@common/types';

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

import styles from './AdminProfessionsPanel.module.scss';
import { createProfession, deleteProfession, updateProfession } from '../../api';
import { useAdminProfessions } from '../../lib';

/** CRUD профессий через модалку (клиентский поиск — словарь ~9 записей, ADR-007). */
export const AdminProfessionsPanel = () => {
  const professions = useAdminProfessions();
  const panel = useAdminCrudPanel<TAdminProfessionItemResponse>();
  const [name, setName] = useState('');

  const filtered = filterByQuery(professions.items, panel.query, (x, q) =>
    x.name.toLowerCase().includes(q)
  );

  const openCreate = () => {
    panel.openCreate();
    setName('');
  };

  const openEdit = (item: TAdminProfessionItemResponse) => {
    panel.openEdit(item);
    setName(item.name);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      panel.setError('Укажите название');
      return;
    }

    const ok = await panel.runPending(async () => {
      if (panel.creating) await createProfession({ name: name.trim() });
      else if (panel.editing) await updateProfession(panel.editing.id, { name: name.trim() });
    });

    if (ok) {
      panel.closeForm();
      void professions.refetch();
    }
  };

  const handleDelete = async () => {
    if (panel.deleting == null) return;
    const ok = await panel.runPending(
      async () => {
        await deleteProfession(panel.deleting!.id);
      },
      { scope: 'delete' }
    );
    if (ok) {
      panel.cancelDelete();
      void professions.refetch();
    }
  };

  return (
    <>
      {professions.error && (
        <p className={styles.error} role="alert">
          {professions.error}
        </p>
      )}

      <LoadMoreSection
        hasMore={professions.hasMore}
        isLoading={professions.loading}
        onLoadMore={() => void professions.loadMore()}
      >
        <AdminCrudList
          addLabel="Добавить профессию"
          emptyText={professions.loading ? 'Загрузка…' : 'Нет записей'}
          getActionLabel={(item) => item.name}
          getKey={(item) => item.id}
          items={filtered}
          renderLabel={(item) => item.name}
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
            <Button disabled={panel.pending} form="profession-form" type="submit">
              Сохранить
            </Button>
          </>
        }
        isOpen={panel.isFormOpen}
        title={panel.creating ? 'Новая профессия' : 'Редактировать профессию'}
        onClose={panel.requestCloseForm}
      >
        <form className={styles.fields} id="profession-form" onSubmit={handleSave}>
          {panel.error && (
            <p className={styles.error} role="alert">
              {panel.error}
            </p>
          )}
          <Input required label="Название" value={name} onChange={(e) => setName(e.target.value)} />
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
        title="Удалить профессию?"
        onClose={panel.requestCancelDelete}
      >
        {panel.error && (
          <p className={styles.error} role="alert">
            {panel.error}
          </p>
        )}
        <p>
          «{panel.deleting?.name}» будет удалена. Если профессия используется персонами, сервер
          отклонит удаление.
        </p>
      </Modal>
    </>
  );
};
