'use client';

import { AdminUsersPanel } from '@/features/manageUsers';
import { Page } from '@/widgets/Layout';

/** Страница пользователей и ролей. */
export const AdminUsersPage = () => (
  <Page title="Пользователи" titleAlign="start">
    <AdminUsersPanel />
  </Page>
);
