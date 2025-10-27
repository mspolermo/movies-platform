import React, { useRef } from 'react';
import { FilterItem } from '../../types/filters';
import styles from './FilterTwoBlocks.module.scss';

interface FilterTwoBlocksProps {
  popularValues: FilterItem[];
  allValues: FilterItem[];
  selectValues: string[];
  handleChangeFilter: (item: string) => void;
}

const firstCharUp = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const FilterTwoBlocks: React.FC<FilterTwoBlocksProps> = ({
  popularValues,
  allValues,
  selectValues,
  handleChangeFilter
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const createPopularValue = () => {
    return popularValues.map((popular) => (
      <button
        key={popular.nameRu}
        className={`${styles.popularButton} ${
          selectValues.includes(popular.nameRu) ? styles.popularButtonActive : ''
        }`}
        onClick={() => handleChangeFilter(popular.nameRu)}
      >
        {firstCharUp(popular.nameRu)}
      </button>
    ));
  };

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
          {/* Popular values carousel */}
          <div className={styles.scrollPane}>
            <div className={styles.viewport}>
              <div className={styles.popularContainer} ref={scrollRef}>
                {createPopularValue()}
              </div>
            </div>
            <button className={styles.scrollButtonLeft} onClick={scrollLeft}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 15L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={styles.scrollButtonRight} onClick={scrollRight}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

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

