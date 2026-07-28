'use client';

import type { TAdminFilmFormPageProps } from './types';

import { useState } from 'react';

import { AdminFilmForm, useAdminFilm } from '@/features/manageFilms';
import { Button, Loader } from '@/shared/ui';
import { Page } from '@/widgets/Layout';

import styles from './AdminFilmFormPage.module.scss';

/** Страница создания/редактирования фильма; при неизвестном id — сообщение внутри оболочки админки. */
export const AdminFilmFormPage = ({ mode, filmId }: TAdminFilmFormPageProps) => {
  const [reloadToken, setReloadToken] = useState(0);
  const filmState = useAdminFilm(mode, filmId, reloadToken);

  if (mode === 'edit' && filmState.status === 'missing') {
    return (
      <Page title="Фильм не найден" titleAlign="start">
        <p className={styles.missing}>
          {filmId == null || Number.isNaN(filmId)
            ? 'Некорректный идентификатор.'
            : 'Нет записи в stub-хранилище.'}
        </p>
      </Page>
    );
  }

  if (mode === 'edit' && filmState.status === 'error') {
    return (
      <Page title="Редактирование фильма" titleAlign="start">
        <p className={styles.error} role="alert">
          {filmState.message}
        </p>
        <Button type="button" variant="outline" onClick={() => setReloadToken((n) => n + 1)}>
          Повторить
        </Button>
      </Page>
    );
  }

  if (mode === 'edit' && filmState.status === 'loading') {
    return (
      <Page title="Редактирование фильма" titleAlign="start">
        <div className={styles.loading}>
          <Loader />
        </div>
      </Page>
    );
  }

  const film = filmState.status === 'ready' ? filmState.film : undefined;
  const title = mode === 'create' ? 'Создать фильм' : 'Редактировать фильм';

  return (
    <Page title={title} titleAlign="start">
      <AdminFilmForm initial={film} mode={mode} />
    </Page>
  );
};
