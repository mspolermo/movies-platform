'use client';

import type { TAdminPersonsPanelProps } from './types';
import type { TPersonAdminItemResponse } from '@common/types';

import type { FormEvent } from 'react';

import { useState } from 'react';

import {
  AdminCrudList,
  Button,
  filterByQuery,
  Input,
  Modal,
  Select,
  useAdminCrudPanel,
} from '@/shared/ui';

import styles from './AdminPersonsPanel.module.scss';
import { createPersonStub, deletePersonStub, updatePersonStub } from '../../api';
import { useAdminPersons } from '../../lib';

/** CRUD персон; опции профессий приходят со страницы (композиция). */
export const AdminPersonsPanel = ({ professionOptions }: TAdminPersonsPanelProps) => {
  const items = useAdminPersons();
  const panel = useAdminCrudPanel<TPersonAdminItemResponse>();
  const [nameRu, setNameRu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [professionIds, setProfessionIds] = useState<number[]>([]);

  const professionNameById = new Map(professionOptions.map((p) => [p.id, p.name]));
  const professionSelectOptions = professionOptions.map((p) => ({
    value: String(p.id),
    label: p.name,
  }));

  const filtered = filterByQuery(
    items,
    panel.query,
    (x, q) => x.nameRu.toLowerCase().includes(q) || x.nameEn.toLowerCase().includes(q)
  );

  const openCreate = () => {
    panel.openCreate();
    setNameRu('');
    setNameEn('');
    setPhotoUrl('');
    setProfessionIds([]);
  };

  const openEdit = (item: TPersonAdminItemResponse) => {
    panel.openEdit(item);
    setNameRu(item.nameRu);
    setNameEn(item.nameEn);
    setPhotoUrl(item.photoUrl);
    setProfessionIds([...item.professionIds]);
  };

  //TODO: почему тип FormEvent?
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!nameRu.trim() || !nameEn.trim()) {
      panel.setError('Заполните имя (RU) и (EN)');
      return;
    }

    const payload = {
      nameRu: nameRu.trim(),
      nameEn: nameEn.trim(),
      photoUrl: photoUrl.trim(),
      professionIds,
    };

    const ok = await panel.runPending(async () => {
      if (panel.creating) await createPersonStub(payload);
      else if (panel.editing) await updatePersonStub(panel.editing.id, payload);
    });

    if (ok) panel.closeForm();
  };

  const handleDelete = async () => {
    if (panel.deleting == null) return;
    const ok = await panel.runPending(
      async () => {
        await deletePersonStub(panel.deleting!.id);
      },
      { scope: 'delete' }
    );
    if (ok) panel.cancelDelete();
  };

  return (
    <>
      <AdminCrudList
        addLabel="Добавить персону"
        getActionLabel={(item) => `${item.nameRu} / ${item.nameEn}`}
        getKey={(item) => item.id}
        items={filtered}
        renderLabel={(item) => (
          <span>
            {item.nameRu} / {item.nameEn}
            {item.professionIds.length > 0 && (
              <span className={styles.meta}>
                {' '}
                ({item.professionIds.map((id) => professionNameById.get(id) ?? `#${id}`).join(', ')}
                )
              </span>
            )}
          </span>
        )}
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
            <Button disabled={panel.pending} form="person-form" type="submit">
              Сохранить
            </Button>
          </>
        }
        isOpen={panel.isFormOpen}
        title={panel.creating ? 'Новая персона' : 'Редактировать персону'}
        onClose={panel.requestCloseForm}
      >
        <form className={styles.fields} id="person-form" onSubmit={handleSave}>
          {panel.error && (
            <p className={styles.error} role="alert">
              {panel.error}
            </p>
          )}
          <Input
            required
            label="Имя (RU)"
            value={nameRu}
            onChange={(e) => setNameRu(e.target.value)}
          />
          <Input
            required
            label="Имя (EN)"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
          />
          <Input label="URL фото" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
          <Select
            multiple
            label="Профессии"
            options={professionSelectOptions}
            value={professionIds.map(String)}
            onChange={(vals) => setProfessionIds(vals.map(Number))}
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
        title="Удалить персону?"
        onClose={panel.requestCancelDelete}
      >
        {panel.error && (
          <p className={styles.error} role="alert">
            {panel.error}
          </p>
        )}
        <p>
          «{panel.deleting?.nameRu} / {panel.deleting?.nameEn}» будет удалена из stub-хранилища.
        </p>
      </Modal>
    </>
  );
};
