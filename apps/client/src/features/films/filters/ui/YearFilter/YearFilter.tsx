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
  const isActive = !selectValues;

  const createYears = (value: number) => {
    if (value === allValues[0]) {
      return (
        <div 
          key={value}
          className={styles.selectAll}
          onClick={() => handleChangeFilter(value)}
        >
          <div className={`${styles.year} ${isActive ? styles.yearWhite : ''}`}>
            Все годы
            {isActive ? (
              <div className={styles.circleMarkChecked}>✓</div>
            ) : (
              <div className={styles.circleMark}>○</div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div 
          key={value}
          className={selectValues === value ? styles.yearWhite : styles.year}
          onClick={() => handleChangeFilter(value)}
        >
          {value}
          {selectValues === value ? (
            <div className={styles.circleMarkChecked}>✓</div>
          ) : (
            <div className={styles.circleMark}>○</div>
          )}
        </div>
      );
    }
  };

  const createYearsMobile = (value: number) => {
    if (!value) {
      return (
        <button
          key={value}
          className={`${styles.mobileButton} ${!selectValues ? styles.mobileButtonActive : ''}`}
          onClick={() => handleChangeFilter(value)}
        >
          Все годы
        </button>
      );
    } else {
      return (
        <button
          key={value}
          className={`${styles.mobileButton} ${selectValues === value ? styles.mobileButtonActive : ''}`}
          onClick={() => handleChangeFilter(value)}
        >
          {value}
        </button>
      );
    }
  };

  return (
    <div className={styles.yearFilter}>
      {/* Desktop version */}
      <div className={styles.content}>
        {allValues.map((value) => createYears(value))}
      </div>

      {/* Mobile version */}
      <div className={styles.mobile}>
        <div className={styles.scroll}>
          {allValues.map((value) => createYearsMobile(value))}
        </div>
      </div>
    </div>
  );
};
