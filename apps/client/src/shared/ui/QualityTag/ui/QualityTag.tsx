import type { TQualityTagProps } from '../model';

import styles from './QualityTag.module.scss';

export const QualityTag = ({ quality }: TQualityTagProps) => {
  return <p className={styles.root}>{quality}</p>;
};
