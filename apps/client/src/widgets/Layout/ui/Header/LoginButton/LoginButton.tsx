'use client';

import Link from 'next/link';

import { useAuth } from '@/entities/user';
import { SvgIcon } from '@/shared/ui';

import styles from './LoginButton.module.scss';

export const LoginButton = ({ onOpen }: { onOpen: () => void }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <span aria-label="Загрузка сессии" className={styles.root}>
        <SvgIcon className={styles.icon} name="person" size={20} />
      </span>
    );
  }

  const href = isAuthenticated ? '/profile' : '/auth/login';
  const label = isAuthenticated ? 'Профиль' : 'Войти';

  return (
    <Link aria-label={label} className={styles.root} href={href} onMouseEnter={onOpen}>
      <SvgIcon className={styles.icon} name="person" size={20} />
    </Link>
  );
};
