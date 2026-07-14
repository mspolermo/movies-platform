'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { logout, useAuth } from '@/features/auth';
import { Button } from '@/shared/ui';
import { Page } from '@/widgets/Layout';

import styles from './ProfilePage.module.scss';

export const ProfilePage = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    window.location.assign('/auth/login');
  };

  if (isLoading) {
    return (
      <Page title="Профиль пользователя">
        <div className={styles.profileCard}>
          <p className={styles.placeholder}>Загрузка профиля...</p>
        </div>
      </Page>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Page title="Профиль пользователя">
        <div className={styles.profileCard}>
          <p className={styles.placeholder}>Перенаправление на вход...</p>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Профиль пользователя">
      <div className={styles.profileCard}>
        <p className={styles.email}>{user.email}</p>
        {user.name && <p className={styles.name}>{user.name}</p>}
        {user.roles.length > 0 && (
          <p className={styles.roles}>Роли: {user.roles.map((role) => role.value).join(', ')}</p>
        )}
        <Button type="button" variant="red" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
    </Page>
  );
};
