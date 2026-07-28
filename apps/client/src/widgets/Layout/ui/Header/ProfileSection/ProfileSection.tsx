'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { buildLoginHref, hasAdminRole, useAuth } from '@/entities/user';
import { logout } from '@/features/auth';
import { AUTH_LOGIN_PATH } from '@/shared/api/session';
import { isNonProduction } from '@/shared/lib';
import { Button } from '@/shared/ui';

import styles from './ProfileSection.module.scss';

/** Выпадающее меню профиля: профиль, админка (роль), Debug (не prod), выход. */
export const ProfileSection = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loginHref, setLoginHref] = useState(AUTH_LOGIN_PATH);

  useEffect(() => {
    setLoginHref(buildLoginHref());
  }, []);

  const handleLogout = async () => {
    await logout();
    // без returnUrl — иначе после повторного логина вернёт на страницу, с которой вышли
    window.location.assign(AUTH_LOGIN_PATH);
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
        <Link className={styles.link} href={loginHref}>
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
      {hasAdminRole(user) && (
        <Link className={styles.link} href="/admin">
          Администрирование
        </Link>
      )}
      {isNonProduction && (
        <Link className={styles.link} href="/debug">
          Debug
        </Link>
      )}
      <Button type="button" variant="red" onClick={handleLogout}>
        Выйти
      </Button>
    </div>
  );
};
