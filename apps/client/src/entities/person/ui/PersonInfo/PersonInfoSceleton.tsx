import React from 'react';

import { Skeleton } from '@/shared/ui';

import styles from './PersonInfo.module.scss';

export const PersonInfoSkeleton = () => {
  return (
    <div className={styles.content}>
      {/* Фото */}
      <Skeleton className={styles.photo} variant="rectangular" />

      {/* Тексты */}
      <div className={styles.name}>
        <Skeleton className={styles.title} variant="text" />
        <Skeleton className={styles.subtitle} variant="text" width="70%" />
      </div>
    </div>
  );
};
