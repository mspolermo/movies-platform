import React from 'react';
import styles from './SloganBlock.module.scss';
import { SvgIcon } from '@/shared/ui';
import { SloganBlockProps } from '../../types';

export const SloganBlock = ({ slogan }: SloganBlockProps) => {
  if (!slogan) return null;

  return (
    <div className={styles.sloganBlock}>
      <SvgIcon
        name="quote-open"
        className={`${styles.quote} ${styles.quoteOpen}`}
        size={12}
      />
      <p className={styles.text}>{slogan}</p>
      <SvgIcon
        name="quote-close"
        className={`${styles.quote} ${styles.quoteClose}`}
        size={12}
      />
    </div>
  );
};
