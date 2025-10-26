import React, { useCallback } from 'react';
import styles from './FilterButton.module.scss';

interface FilterButtonProps {
  filterName: string;
  selectedFiltersBy: string | number;
  activeBlock: string[];
  blockName: string;
  setActiveBlock: (activeBlockName: string[]) => void;
  children: React.ReactNode;
  isWideMenu?: boolean;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  filterName,
  selectedFiltersBy,
  activeBlock,
  blockName,
  setActiveBlock,
  children,
  isWideMenu = false
}) => {
  const isActive = activeBlock.includes(blockName);

  const handleToggle = useCallback(() => {
    if (isActive) {
      setActiveBlock([]);
    } else {
      setActiveBlock([blockName]);
    }
  }, [isActive, blockName, setActiveBlock]);

  return (
    <div className={styles.filterButton}>
      <div className={styles.container}>
        <div className={`${styles.content} ${isActive ? styles.contentActive : ''}`}>
          <div className={styles.header} onClick={handleToggle}>
            <div className={styles.title}>{filterName}</div>
            {selectedFiltersBy && (
              <div className={styles.subtitle}>{selectedFiltersBy}</div>
            )}
          </div>
          <div className={`${styles.arrow} ${isActive ? styles.arrowReverse : ''}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className={`${styles.menu} ${isActive ? styles.menuVisible : ''} ${isWideMenu ? styles.menuWide : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
