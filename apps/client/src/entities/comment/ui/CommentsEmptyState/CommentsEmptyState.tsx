import type { ReactNode } from 'react';

import styles from './CommentsEmptyState.module.scss';

type TCommentsEmptyStateProps = {
  filmName: string;
  message?: ReactNode;
};

export const CommentsEmptyState = ({ filmName, message }: TCommentsEmptyStateProps) => (
  <p className={styles.empty}>{message ?? <>На фильм «{filmName}» ещё нет отзывов</>}</p>
);
