'use client';

import Link from 'next/link';

import { useAuthStore } from '@/features/auth';
import { SvgIcon } from '@/shared/ui';

import styles from './LoginButton.module.scss';

export const LoginButton = ({ onOpen }: { onOpen: () => void }) => {
  const { isAuthenticated } = useAuthStore();

  const href = isAuthenticated ? '/profile' : '/auth/login';
  const label = isAuthenticated ? 'Профиль' : 'Войти';

  return (
    <Link
      aria-label={label}
      className={styles.root}
      href={href}
      onMouseEnter={onOpen}
    >
      <SvgIcon
        className={styles.icon}
        name={isAuthenticated ? 'personFull' : 'person'}
        size={20}
      />
    </Link>
  );
};
