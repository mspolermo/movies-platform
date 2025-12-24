import React from 'react';
import cn from 'classnames';
import styles from './YearFilter.module.scss';

interface YearFilterProps {
  allValues: number[];
  selectValue: number | null;
  onChange: (year: number | null) => void;
}

export const YearFilter = ({
  allValues,
  selectValue,
  onChange,
}: YearFilterProps) => {
  const values = allValues.filter(
    (v): v is number => v !== null && v !== undefined
  );

  return (
    <div className={styles.yearFilter}>
      {/* Desktop */}
      <div className={styles.content}>
        {values.map(year => {
          const isActive = selectValue === year;

          return (
            <div
              key={year}
              className={cn(
                styles.yearOption,
                isActive && styles.yearOptionActive
              )}
              onClick={() => onChange(isActive ? null : year)}
            >
              {year}

              {isActive ? (
                <div className={styles.circleMarkChecked}>✓</div>
              ) : (
                <div className={styles.circleMark}>○</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className={styles.mobile}>
        <div className={styles.scroll}>
          {values.map(year => {
            const isActive = selectValue === year;

            return (
              <button
                key={year}
                type="button"
                className={cn(
                  styles.mobileButton,
                  isActive && styles.mobileButtonActive
                )}
                onClick={() => onChange(isActive ? null : year)}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
