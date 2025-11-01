import React from 'react';
import { FilterItem } from '../../types/filters';
import styles from './FilterTwoBlocks.module.scss';

interface FilterTwoBlocksProps {
  allValues: FilterItem[];
  selectValues: string[];
  handleChangeFilter: (item: string) => void;
}

const firstCharUp = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const FilterTwoBlocks: React.FC<FilterTwoBlocksProps> = ({
  allValues,
  selectValues,
  handleChangeFilter
}) => {
  const createMobileValue = () => {
    return allValues.map((value) => (
      <button
        key={value.nameRu}
        className={`${styles.popularButton} ${
          selectValues.includes(value.nameRu) ? styles.popularButtonActive : ''
        }`}
        onClick={() => handleChangeFilter(value.nameRu)}
      >
        {firstCharUp(value.nameRu)}
      </button>
    ));
  };

  return (
    <div className={styles.filterTwoBlocks}>
      {/* Desktop version */}
      <div className={styles.container}>
        <div 
          className={styles.content}
          onClick={(e) => e.stopPropagation()}
        >
          {/* All values list */}
          <div className={styles.listContainer}>
            {allValues.map((value) => (
              <div 
                key={value.nameRu}
                className={`${styles.listItem} ${
                  selectValues.includes(value.nameRu) ? styles.listItemActive : ''
                }`}
                onClick={() => handleChangeFilter(value.nameRu)}
              >
                <span className={styles.text}>
                  {firstCharUp(value.nameRu)}
                </span>
                <div className={`${styles.checkmark} ${
                  selectValues.includes(value.nameRu) ? styles.checkmarkActive : ''
                }`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className={styles.mobile}>
        <div className={styles.mobileScroll}>
          <div className={styles.mobileViewport}>
            <div className={styles.mobileContainer}>
              {createMobileValue()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

