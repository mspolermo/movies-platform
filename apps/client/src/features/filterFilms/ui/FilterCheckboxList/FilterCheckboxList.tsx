import React from 'react';
import cn from 'classnames';
import { FilterItem } from '../../types/filters';
import styles from './FilterCheckboxList.module.scss';
import { capitalizeFirst } from '@/shared/lib';

interface FilterCheckboxListProps {
  allValues: FilterItem[];
  selectedValues: string[];
  onChange: (value: string) => void;
}

export const FilterCheckboxList: React.FC<FilterCheckboxListProps> = ({
  allValues,
  selectedValues,
  onChange,
}) => {
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
                  type="button"
                  className={cn(styles.item, {
                    [styles.itemActive]: active,
                  })}
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
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.5 4.5L6 12L2.5 8.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
                type="button"
                className={cn(styles.chip, {
                  [styles.chipActive]: active,
                })}
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
