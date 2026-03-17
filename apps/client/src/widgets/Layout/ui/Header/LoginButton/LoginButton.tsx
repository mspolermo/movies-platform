'use client';

import Link from 'next/link';
import { SvgIcon } from '@/shared/ui/SvgIcon';
import { useAuthStore } from '@/features/auth';
import styles from './LoginButton.module.scss';

export const LoginButton = ({onOpen}: {onOpen: () => void;}) => {
  const { isAuthenticated } = useAuthStore();

  const href = isAuthenticated ? '/profile' : '/auth/login';
  const label = isAuthenticated ? 'Профиль' : 'Войти';

  return (
    <Link
      href={href}
      className={styles.root}
      aria-label={label}
      onMouseEnter={onOpen}
    >
      <SvgIcon
        name={isAuthenticated ? 'personFull' : 'person'}
        size={20}
        className={styles.icon}
      />
    </Link>
  );
};