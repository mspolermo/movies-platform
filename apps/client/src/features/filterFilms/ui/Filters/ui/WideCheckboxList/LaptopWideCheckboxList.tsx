import type { TWideCheckboxListViewProps } from './types';

import cn from 'classnames';

import { SvgIcon } from '@/shared/ui';

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
                  <SvgIcon icon="checkmark" size={16} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
