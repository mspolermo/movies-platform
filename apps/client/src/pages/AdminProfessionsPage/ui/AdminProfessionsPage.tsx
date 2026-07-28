'use client';

import { AdminProfessionsPanel } from '@/features/manageProfessions';
import { Page } from '@/widgets/Layout';

/** Страница CRUD профессий. */
export const AdminProfessionsPage = () => (
  <Page title="Профессии" titleAlign="start">
    <AdminProfessionsPanel />
  </Page>
);
