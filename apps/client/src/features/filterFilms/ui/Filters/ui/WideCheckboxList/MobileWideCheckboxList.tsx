import type { TWideCheckboxListViewProps } from './types';

import cn from 'classnames';

import styles from './styles/MobileWideCheckboxList.module.scss';

export const MobileWideCheckboxList = ({
  entries,
  isSelected,
  onToggle,
}: TWideCheckboxListViewProps) => {
  return (
    <div className={styles.root}>
      <div className={styles.scroll}>
        {entries.map(({ key, value, label }) => {
          const active = isSelected(value);

          return (
            <button
              key={key}
              className={cn(styles.chip, active && styles.chipActive)}
              type="button"
              onClick={() => onToggle(value)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
