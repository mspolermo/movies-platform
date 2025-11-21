'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SvgIcon } from '@/shared/ui/SvgIcon';
import styles from './HeaderSearch.module.scss';

//TODO: переделать

export const HeaderSearch = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/search');
  };

  return (
    <div className={styles.search}>
      <button
        className={styles.button}
        onClick={handleRedirect}
        data-testid="headerSearch"
      >
        <SvgIcon name="search" className={styles.icon} size={20} />
        <span className={styles.text}>Поиск</span>
      </button>
    </div>
  );
};
