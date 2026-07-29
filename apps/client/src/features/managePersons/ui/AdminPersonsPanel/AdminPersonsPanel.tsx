'use client';

import type { TAdminPersonsPanelProps } from './types';
import type { TPersonAdminItemResponse } from '@common/types';

import type { FormEvent } from 'react';

import { useState } from 'react';

import {
  AdminCrudList,
  Button,
  Input,
  LoadMoreSection,
  Modal,
  Select,
  useAdminCrudPanel,
} from '@/shared/ui';

import styles from './AdminPersonsPanel.module.scss';
import { createPerson, deletePerson, updatePerson } from '../../api';
import { useAdminPersons } from '../../lib';

/** CRUD персон (серверный поиск); опции профессий приходят со страницы (композиция). */
export const AdminPersonsPanel = ({ professionOptions }: TAdminPersonsPanelProps) => {
  const panel = useAdminCrudPanel<TPersonAdminItemResponse>();
  const persons = useAdminPersons(panel.query);
  const [nameRu, setNameRu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [professionIds, setProfessionIds] = useState<number[]>([]);

  const professionNameById = new Map(professionOptions.map((p) => [p.id, p.name]));
  const professionSelectOptions = professionOptions.map((p) => ({
    value: String(p.id),
    label: p.name,
  }));

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

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!nameRu.trim() || !nameEn.trim()) {
      panel.setError('Заполните имя (RU) и (EN)');
      return;
    }

    const ok = await panel.runPending(async () => {
      if (panel.creating) {
        await createPerson({
          nameRu: nameRu.trim(),
          nameEn: nameEn.trim(),
          photoUrl: photoUrl.trim(),
          professionIds,
        });
      } else if (panel.editing) {
        // Опустевший photoUrl в edit-режиме → null («очистить», ADR-007)
        await updatePerson(panel.editing.id, {
          nameRu: nameRu.trim(),
          nameEn: nameEn.trim(),
          photoUrl: photoUrl.trim() || null,
          professionIds,
        });
      }
    });

    if (ok) {
      panel.closeForm();
      void persons.refetch();
    }
  };

  const handleDelete = async () => {
    if (panel.deleting == null) return;
    const ok = await panel.runPending(
      async () => {
        await deletePerson(panel.deleting!.id);
      },
      { scope: 'delete' }
    );
    if (ok) {
      panel.cancelDelete();
      void persons.refetch();
    }
  };

  return (
    <>
      {persons.error && (
        <p className={styles.error} role="alert">
          {persons.error}
        </p>
      )}

      <LoadMoreSection
        hasMore={persons.hasMore}
        isLoading={persons.loading}
        onLoadMore={() => void persons.loadMore()}
      >
        <AdminCrudList
          addLabel="Добавить персону"
          emptyText={persons.loading ? 'Загрузка…' : 'Персоны не найдены'}
          getActionLabel={(item) => `${item.nameRu} / ${item.nameEn}`}
          getKey={(item) => item.id}
          items={persons.items}
          renderLabel={(item) => (
            <span>
              {item.nameRu} / {item.nameEn}
              {item.professionIds.length > 0 && (
                <span className={styles.meta}>
                  {' '}
                  (
                  {item.professionIds
                    .map((id) => professionNameById.get(id) ?? `#${id}`)
                    .join(', ')}
                  )
                </span>
              )}
            </span>
          )}
          searchPlaceholder="Поиск по имени"
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
          «{panel.deleting?.nameRu} / {panel.deleting?.nameEn}» будет удалена. Если персона
          участвует в фильмах, сервер отклонит удаление.
        </p>
      </Modal>
    </>
  );
};
