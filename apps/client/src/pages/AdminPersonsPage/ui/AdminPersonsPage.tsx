'use client';

import { AdminPersonsPanel } from '@/features/managePersons';
import { useAdminProfessions } from '@/features/manageProfessions';
import { Page } from '@/widgets/Layout';

/** Страница CRUD персон и список опций профессий. */
export const AdminPersonsPage = () => {
  const professionOptions = useAdminProfessions();

  return (
    <Page title="Персоны" titleAlign="start">
      <AdminPersonsPanel professionOptions={professionOptions} />
    </Page>
  );
};
