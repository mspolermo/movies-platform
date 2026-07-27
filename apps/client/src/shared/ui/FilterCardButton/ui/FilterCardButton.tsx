import type { TFilterCardButtonProps } from '../model';

import styles from './FilterCardButton.module.scss';

/** Визуальная оболочка карточки; интерактив — у родителя (`Link` и т.п.). */
export const FilterCardButton = ({ children, className = '' }: TFilterCardButtonProps) => {
  return <div className={`${styles.card} ${className}`.trim()}>{children}</div>;
};
