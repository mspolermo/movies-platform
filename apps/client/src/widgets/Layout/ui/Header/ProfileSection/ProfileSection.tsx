'use client';

import Link from 'next/link';

import { logout, useAuth } from '@/features/auth';
import { Button } from '@/shared/ui';

import styles from './ProfileSection.module.scss';

export const ProfileSection = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.assign('/auth/login');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.placeholder}>Загрузка...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.container}>
        <p className={styles.placeholder}>Вы не авторизованы</p>
        <Link className={styles.link} href="/auth/login">
          Войти
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className={styles.email}>{user.email}</p>
      {user.name && <p className={styles.name}>{user.name}</p>}
      {user.roles.length > 0 && (
        <p className={styles.roles}>{user.roles.map((role) => role.value).join(', ')}</p>
      )}
      <Link className={styles.link} href="/profile">
        Открыть профиль
      </Link>
      <Button type="button" variant="red" onClick={handleLogout}>
        Выйти
      </Button>
    </div>
  );
};
