import type { FilterItem } from '../../types';

import cn from 'classnames';

import { capitalizeFirst } from '@/shared/lib';

import styles from './FilterCheckboxList.module.scss';

const itemLabel = (item: FilterItem): string =>
  'countryName' in item ? item.countryName : item.nameRu;

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
            {allValues.map((item) => {
              const label = itemLabel(item);
              const active = isSelected(label);

              return (
                <button
                  key={label}
                  className={cn(styles.item, {
                    [styles.itemActive]: active,
                  })}
                  type="button"
                  onClick={() => onChange(label)}
                >
                  <span className={styles.label}>{capitalizeFirst(label)}</span>

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
          {allValues.map((item) => {
            const label = itemLabel(item);
            const active = isSelected(label);

            return (
              <button
                key={label}
                className={cn(styles.chip, {
                  [styles.chipActive]: active,
                })}
                type="button"
                onClick={() => onChange(label)}
              >
                {capitalizeFirst(label)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
