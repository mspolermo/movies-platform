'use client';

import type { PropsWithChildren } from 'react';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { buildLoginHref, hasAdminRole, useAuth } from '@/entities/user';
import { Loader, NotFoundView } from '@/shared/ui';
import { AdminLayout } from '@/widgets/AdminLayout';
import { Page } from '@/widgets/Layout';

import styles from './AdminRootLayout.module.scss';

/**
 * Шлюз `/admin/*`: загрузка → логин (returnUrl) → мягкий 404 (тот же UI, что NotFoundPage).
 * Оболочка (сайдбар) — widgets/AdminLayout.
 */
export const AdminRootLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(buildLoginHref());
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.loading}>
        <p>Перенаправление на вход...</p>
      </div>
    );
  }

  if (!hasAdminRole(user)) {
    return (
      <Page title="Страница не найдена">
        <NotFoundView />
      </Page>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
};
