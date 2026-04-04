import type { TWideCheckboxListViewProps } from './types';

import cn from 'classnames';

import styles from './styles/LaptopWideCheckboxList.module.scss';

export const LaptopWideCheckboxList = ({
  entries,
  isSelected,
  onToggle,
}: TWideCheckboxListViewProps) => {
  return (
    <div className={styles.root}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.list}>
          {entries.map(({ key, value, label }) => {
            const active = isSelected(value);

            return (
              <button
                key={key}
                className={cn(styles.item, active && styles.itemActive)}
                type="button"
                onClick={() => onToggle(value)}
              >
                <span className={styles.label}>{label}</span>

                <span
                  className={cn(styles.checkmark, {
                    [styles.checkmarkVisible]: active,
                  })}
                >
                  <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
                    <path
                      d="M13.5 4.5L6 12L2.5 8.5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
