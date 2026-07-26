import type { SloganProps } from '../../types';

import cn from 'classnames';

import { SvgIcon } from '@/shared/ui';

import styles from './Slogan.module.scss';

export const Slogan = ({ film: { slogan } }: SloganProps) => {
  if (!slogan) return null;

  return (
    <div className={styles.container}>
      <SvgIcon className={cn(styles.quote, styles.quoteOpen)} icon="quoteOpen" size={12} />
      <p className={styles.text}>{slogan}</p>
      <SvgIcon className={cn(styles.quote, styles.quoteClose)} icon="quoteClose" size={12} />
    </div>
  );
};
