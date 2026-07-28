'use client';

import { AdminFilmsList } from '@/features/manageFilms';
import { Page } from '@/widgets/Layout';

/** Страница списка фильмов админки. */
export const AdminFilmsPage = () => (
  <Page title="Фильмы" titleAlign="start">
    <AdminFilmsList />
  </Page>
);
