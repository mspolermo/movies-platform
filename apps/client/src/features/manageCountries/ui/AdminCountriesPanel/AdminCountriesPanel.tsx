'use client';

import type { TCountryAdminItemResponse } from '@common/types';

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

import styles from './AdminCountriesPanel.module.scss';
import { createCountry, deleteCountry, updateCountry } from '../../api';
import { useAdminCountries } from '../../lib';

/** CRUD стран через модалку и /admin/countries. */
export const AdminCountriesPanel = () => {
  const countries = useAdminCountries();
  const panel = useAdminCrudPanel<TCountryAdminItemResponse>();
  const [countryName, setCountryName] = useState('');
  const [countryNameEn, setCountryNameEn] = useState('');

  const filtered = filterByQuery(
    countries.items,
    panel.query,
    (x, q) => x.countryName.toLowerCase().includes(q) || x.countryNameEn.toLowerCase().includes(q)
  );

  const openCreate = () => {
    panel.openCreate();
    setCountryName('');
    setCountryNameEn('');
  };

  const openEdit = (item: TCountryAdminItemResponse) => {
    panel.openEdit(item);
    setCountryName(item.countryName);
    setCountryNameEn(item.countryNameEn);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!countryName.trim() || !countryNameEn.trim()) {
      panel.setError('Заполните название (RU) и (EN)');
      return;
    }

    const payload = {
      countryName: countryName.trim(),
      countryNameEn: countryNameEn.trim(),
    };

    const ok = await panel.runPending(async () => {
      if (panel.creating) await createCountry(payload);
      else if (panel.editing) await updateCountry(panel.editing.id, payload);
    });

    if (ok) {
      panel.closeForm();
      void countries.refetch();
    }
  };

  const handleDelete = async () => {
    if (panel.deleting == null) return;
    const ok = await panel.runPending(
      async () => {
        await deleteCountry(panel.deleting!.id);
      },
      { scope: 'delete' }
    );
    if (ok) {
      panel.cancelDelete();
      void countries.refetch();
    }
  };

  return (
    <>
      {countries.error && (
        <p className={styles.error} role="alert">
          {countries.error}
        </p>
      )}

      <LoadMoreSection
        hasMore={countries.hasMore}
        isLoading={countries.loading}
        onLoadMore={() => void countries.loadMore()}
      >
        <AdminCrudList
          addLabel="Добавить страну"
          emptyText={countries.loading ? 'Загрузка…' : 'Нет записей'}
          getActionLabel={(item) => `${item.countryName} / ${item.countryNameEn}`}
          getKey={(item) => item.id}
          items={filtered}
          renderLabel={(item) => `${item.countryName} / ${item.countryNameEn}`}
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
            <Button disabled={panel.pending} form="country-form" type="submit">
              Сохранить
            </Button>
          </>
        }
        isOpen={panel.isFormOpen}
        title={panel.creating ? 'Новая страна' : 'Редактировать страну'}
        onClose={panel.requestCloseForm}
      >
        <form className={styles.fields} id="country-form" onSubmit={handleSave}>
          {panel.error && (
            <p className={styles.error} role="alert">
              {panel.error}
            </p>
          )}
          <Input
            required
            label="Название (RU)"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
          />
          <Input
            required
            label="Название (EN)"
            value={countryNameEn}
            onChange={(e) => setCountryNameEn(e.target.value)}
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
        title="Удалить страну?"
        onClose={panel.requestCancelDelete}
      >
        {panel.error && (
          <p className={styles.error} role="alert">
            {panel.error}
          </p>
        )}
        <p>
          «{panel.deleting?.countryName} / {panel.deleting?.countryNameEn}» будет удалена. Если
          страна привязана к фильмам, сервер отклонит удаление.
        </p>
      </Modal>
    </>
  );
};
