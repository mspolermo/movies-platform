import type { ReactNode } from 'react';

import cn from 'classnames';
import { useCallback } from 'react';

import styles from './FilterDropdown.module.scss';

interface FilterDropdownProps {
  filterName: string;
  selectedFiltersBy: string | number;
  activeBlock: string[];
  blockName: string;
  setActiveBlock: (activeBlockName: string[]) => void;
  children: ReactNode;
  isWideMenu?: boolean;
}

export const FilterDropdown = ({
  filterName,
  selectedFiltersBy,
  activeBlock,
  blockName,
  setActiveBlock,
  children,
  isWideMenu = false,
}: FilterDropdownProps) => {
  const isOpen = activeBlock.includes(blockName);

  const toggle = useCallback(() => {
    setActiveBlock(isOpen ? [] : [blockName]);
  }, [isOpen, blockName, setActiveBlock]);

  return (
    <div
      className={cn(styles.dropdown, {
        [styles.wide]: isWideMenu,
      })}
    >
      <div className={styles.desktop}>
        <div
          className={cn(styles.control, {
            [styles.controlOpen]: isOpen,
          })}
          onClick={toggle}
        >
          <div className={styles.text}>
            <div className={styles.title}>{filterName}</div>

            {!!selectedFiltersBy && <div className={styles.subtitle}>{selectedFiltersBy}</div>}
          </div>

          <div
            className={cn(styles.arrow, {
              [styles.arrowOpen]: isOpen,
            })}
          >
            <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <div
          className={cn(styles.menu, {
            [styles.menuOpen]: isOpen,
            [styles.menuWide]: isWideMenu,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
