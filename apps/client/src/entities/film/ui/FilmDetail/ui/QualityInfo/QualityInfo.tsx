import type { QualityInfoProps } from '../../types';

import React from 'react';

import { QualityTag } from '@/shared/ui';

import styles from './QualityInfo.module.scss';

/**
 * Блок информации о качестве, языках и субтитрах.
 */
export const QualityInfo = ({ view }: QualityInfoProps) => {
  if (view === 'desktop') {
    return (
      <div className={styles.card}>
        <span>Язык</span>
        <span className={styles.active}>Русский, Английский</span>

        <span>Субтитры</span>
        <span className={styles.active}>Русский, Английский</span>

        <span>Качество видео</span>
        <div className={styles.tags}>
          <QualityTag quality="FullHD" />
          <QualityTag quality="HD" />
          <QualityTag quality="1080" />
          <QualityTag quality="720" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.additionalInfoBlock}>
      <div className={styles.line}>
        <p className={styles.text}>Язык</p>
        <p className={styles.text}>Русский, Английский</p>
      </div>
      <div className={`${styles.line} ${styles.lineAdditional}`}>
        <p className={styles.text}>Субтитры</p>
        <p className={styles.text}>Русский, Английский</p>
      </div>
      <div className={styles.line}>
        <p className={styles.text}>Качество</p>
        <div className={styles.icons}>
          <QualityTag quality="FullHD" />
          <QualityTag quality="HD" />
          <QualityTag quality="1080" />
          <QualityTag quality="720" />
        </div>
      </div>
    </div>
  );
};
