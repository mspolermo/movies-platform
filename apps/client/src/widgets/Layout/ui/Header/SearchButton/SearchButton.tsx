'use client';

import Link from 'next/link';

import { SvgIcon } from '@/shared/ui';

import styles from './SearchButton.module.scss';

export const SearchButton = () => (
  <Link aria-label="Поиск" className={styles.root} href="/search">
    <SvgIcon className={styles.icon} name="search" size={20} />

    <span className={styles.label}>Поиск</span>
  </Link>
);
