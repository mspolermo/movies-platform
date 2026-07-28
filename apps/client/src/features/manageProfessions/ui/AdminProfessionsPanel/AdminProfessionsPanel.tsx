'use client';

import type { TProfessionAdminItemResponse } from '@common/types';

import type { FormEvent } from 'react';

import { useState } from 'react';

import { AdminCrudList, Button, filterByQuery, Input, Modal, useAdminCrudPanel } from '@/shared/ui';

import styles from './AdminProfessionsPanel.module.scss';
import { createProfessionStub, deleteProfessionStub, updateProfessionStub } from '../../api';
import { useAdminProfessions } from '../../lib';

/** CRUD профессий через модалку и хранилище-заглушку. */
export const AdminProfessionsPanel = () => {
  const items = useAdminProfessions();
  const panel = useAdminCrudPanel<TProfessionAdminItemResponse>();
  const [name, setName] = useState('');

  const filtered = filterByQuery(items, panel.query, (x, q) => x.name.toLowerCase().includes(q));

  const openCreate = () => {
    panel.openCreate();
    setName('');
  };

  const openEdit = (item: TProfessionAdminItemResponse) => {
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
      if (panel.creating) await createProfessionStub({ name: name.trim() });
      else if (panel.editing) await updateProfessionStub(panel.editing.id, { name: name.trim() });
    });

    if (ok) panel.closeForm();
  };

  const handleDelete = async () => {
    if (panel.deleting == null) return;
    const ok = await panel.runPending(
      async () => {
        await deleteProfessionStub(panel.deleting!.id);
      },
      { scope: 'delete' }
    );
    if (ok) panel.cancelDelete();
  };

  return (
    <>
      <AdminCrudList
        addLabel="Добавить профессию"
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
        <p>«{panel.deleting?.name}» будет удалена из stub-хранилища.</p>
      </Modal>
    </>
  );
};
