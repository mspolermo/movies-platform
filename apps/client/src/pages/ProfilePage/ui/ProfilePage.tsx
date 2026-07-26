'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { buildLoginHref, useAuth } from '@/entities/user';
import { logout } from '@/features/auth';
import { AUTH_LOGIN_PATH } from '@/shared/api/session';
import { Button } from '@/shared/ui';
import { Page } from '@/widgets/Layout';

import styles from './ProfilePage.module.scss';

export const ProfilePage = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(buildLoginHref());
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    // без returnUrl — иначе после повторного логина вернёт на профиль
    window.location.assign(AUTH_LOGIN_PATH);
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
