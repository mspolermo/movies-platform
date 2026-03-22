import type { FilterItem } from '../../types';

import cn from 'classnames';

import { capitalizeFirst } from '@/shared/lib';

import styles from './FilterCheckboxList.module.scss';

interface FilterCheckboxListProps {
  allValues: FilterItem[];
  selectedValues: string[];
  onChange: (value: string) => void;
}

export const FilterCheckboxList = ({
  allValues,
  selectedValues,
  onChange,
}: FilterCheckboxListProps) => {
  const isSelected = (value: string) => selectedValues.includes(value);

  return (
    <div className={styles.root}>
      {/* Desktop */}
      <div className={styles.desktop}>
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.list}>
            {allValues.map(({ nameRu }) => {
              const active = isSelected(nameRu);

              return (
                <button
                  key={nameRu}
                  className={cn(styles.item, {
                    [styles.itemActive]: active,
                  })}
                  type="button"
                  onClick={() => onChange(nameRu)}
                >
                  <span className={styles.label}>
                    {capitalizeFirst(nameRu)}
                  </span>

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

      {/* Mobile */}
      <div className={styles.mobile}>
        <div className={styles.mobileList}>
          {allValues.map(({ nameRu }) => {
            const active = isSelected(nameRu);

            return (
              <button
                key={nameRu}
                className={cn(styles.chip, {
                  [styles.chipActive]: active,
                })}
                type="button"
                onClick={() => onChange(nameRu)}
              >
                {capitalizeFirst(nameRu)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
