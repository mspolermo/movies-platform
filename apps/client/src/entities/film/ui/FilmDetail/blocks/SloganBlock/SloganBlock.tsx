import type { SloganBlockProps } from '../../types';

import React from 'react';

import { SvgIcon } from '@/shared/ui';

import styles from './SloganBlock.module.scss';

export const SloganBlock = ({ slogan }: SloganBlockProps) => {
  if (!slogan) return null;

  return (
    <div className={styles.sloganBlock}>
      <SvgIcon
        className={`${styles.quote} ${styles.quoteOpen}`}
        name="quote-open"
        size={12}
      />
      <p className={styles.text}>{slogan}</p>
      <SvgIcon
        className={`${styles.quote} ${styles.quoteClose}`}
        name="quote-close"
        size={12}
      />
    </div>
  );
};
