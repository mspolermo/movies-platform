import React from 'react';
import styles from './YearFilter.module.scss';

interface YearFilterProps {
  allValues: number[];
  selectValues: number | null | string;
  handleChangeFilter: (year: number | null) => void;
}

export const YearFilter: React.FC<YearFilterProps> = ({
  allValues,
  selectValues,
  handleChangeFilter
}) => {
  const normalizedValues = allValues.filter(
    (value): value is number => value !== null && value !== undefined
  );

  const createYears = (value: number) => (
    <div 
      key={value}
      className={`${styles.yearOption} ${selectValues === value ? styles.yearOptionActive : ''}`}
      onClick={() => handleChangeFilter(selectValues === value ? null : value)}
    >
      {value}
      {selectValues === value ? (
        <div className={styles.circleMarkChecked}>✓</div>
      ) : (
        <div className={styles.circleMark}>○</div>
      )}
    </div>
  );

  const createYearsMobile = (value: number) => {
    return (
      <button
        key={value}
        className={`${styles.mobileButton} ${selectValues === value ? styles.mobileButtonActive : ''}`}
        onClick={() => handleChangeFilter(selectValues === value ? null : value)}
      >
        {value}
      </button>
    );
  };

  return (
    <div className={styles.yearFilter}>
      {/* Desktop version */}
      <div className={styles.content}>
        {normalizedValues.map((value) => createYears(value))}
      </div>

      {/* Mobile version */}
      <div className={styles.mobile}>
        <div className={styles.scroll}>
          {normalizedValues.map((value) => createYearsMobile(value))}
        </div>
      </div>
    </div>
  );
};
