'use client';

import Link from 'next/link';

import { SvgIcon } from '@/shared/ui';

import styles from './LoginButton.module.scss';

export const LoginButton = ({ onOpen }: { onOpen: () => void }) => {
  const href = '/auth/login';
  const label = 'Войти';

  return (
    <Link aria-label={label} className={styles.root} href={href} onMouseEnter={onOpen}>
      <SvgIcon className={styles.icon} name="person" size={20} />
    </Link>
  );
};
