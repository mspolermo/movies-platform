import type { TFilterCheckboxListProps } from '../../../../model';

import cn from 'classnames';

import styles from './ShortCheckboxList.module.scss';
import { FilterDropdown } from '../FilterDropdown';

export const ShortCheckboxList = ({
  type,
  allValues,
  selectedValues,
  onChange,
}: TFilterCheckboxListProps<'years'>) => {
  const values = allValues.filter((v): v is number => v !== null && v !== undefined);

  const isSelected = (year: number) => selectedValues.includes(year);

  const toggleYear = (year: number) => {
    const next = isSelected(year)
      ? selectedValues.filter((y) => y !== year)
      : [...selectedValues, year];
    onChange({ years: next });
  };

  return (
    <FilterDropdown
      blockName={type}
      filterName="Годы"
      isWideMenu={false}
      selectedFiltersBy={selectedValues.join(', ')}
    >
      <div className={styles.yearFilter}>
        {/* Desktop */}
        <div className={styles.content}>
          {values.map((year) => {
            const active = isSelected(year);

            return (
              <div
                key={year}
                className={cn(styles.yearOption, active && styles.yearOptionActive)}
                onClick={() => toggleYear(year)}
              >
                {year}

                {active ? (
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
            {values.map((year) => {
              const active = isSelected(year);

              return (
                <button
                  key={year}
                  className={cn(styles.mobileButton, active && styles.mobileButtonActive)}
                  type="button"
                  onClick={() => toggleYear(year)}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </FilterDropdown>
  );
};
