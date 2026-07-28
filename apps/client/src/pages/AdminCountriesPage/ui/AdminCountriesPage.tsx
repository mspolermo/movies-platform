'use client';

import { AdminCountriesPanel } from '@/features/manageCountries';
import { Page } from '@/widgets/Layout';

/** Страница CRUD стран. */
export const AdminCountriesPage = () => (
  <Page title="Страны" titleAlign="start">
    <AdminCountriesPanel />
  </Page>
);
