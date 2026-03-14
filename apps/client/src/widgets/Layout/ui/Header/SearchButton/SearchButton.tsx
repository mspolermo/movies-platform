'use client';

import Link from 'next/link';
import { SvgIcon } from '@/shared/ui/SvgIcon';
import styles from './SearchButton.module.scss';

export const SearchButton = () => (
  <Link
    href="/search"
    className={styles.root}
    aria-label="Поиск"
  >
    <SvgIcon
      name="search"
      size={20}
      className={styles.icon}
    />

    <span className={styles.label}>
      Поиск
    </span>
  </Link>
);