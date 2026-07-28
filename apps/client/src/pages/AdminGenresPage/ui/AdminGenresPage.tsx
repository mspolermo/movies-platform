'use client';

import { AdminGenresPanel } from '@/features/manageGenres';
import { Page } from '@/widgets/Layout';

/** Страница CRUD жанров. */
export const AdminGenresPage = () => (
  <Page title="Жанры" titleAlign="start">
    <AdminGenresPanel />
  </Page>
);
