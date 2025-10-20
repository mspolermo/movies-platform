import React from 'react';
import styles from './AdditionalInfoBlock.module.scss';
import { QualityTag } from '@/shared/ui';

export const AdditionalInfoBlock = () => {
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
