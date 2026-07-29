'use client';

import { AdminPersonsPanel } from '@/features/managePersons';
import { useAdminProfessions } from '@/features/manageProfessions';
import { Page } from '@/widgets/Layout';

/** Страница CRUD персон и список опций профессий (словарь целиком в первой странице). */
export const AdminPersonsPage = () => {
  const professions = useAdminProfessions();

  return (
    <Page title="Персоны" titleAlign="start">
      <AdminPersonsPanel professionOptions={professions.items} />
    </Page>
  );
};
