import type { TFilterDropdownProps } from '../../model';

import cn from 'classnames';
import { useCallback, useRef } from 'react';

import { SvgIcon } from '@/shared/ui';

import styles from './FilterDropdown.module.scss';
import { useCloseOnOutsideClick } from '../../lib';
import { useFiltersDropdown } from '../../model';

/**
 * Обёртка фильтра с выпадающим меню.
 *
 * Показывает название фильтра, выбранные значения и
 * управляет открытием/закрытием через контекст.
 */
export const FilterDropdown = ({
  filterName,
  selectedFiltersBy,
  blockName,
  children,
  isWideMenu = false,
}: TFilterDropdownProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { isOpen, toggleBlock, close } = useFiltersDropdown();
  const open = isOpen(blockName);

  /** Граница «снаружи» — сам дропдаун, а не весь блок Filters (чтобы клик по соседнему фильтру закрывал панель). */
  useCloseOnOutsideClick(rootRef, open, close);

  const handleToggle = useCallback(() => {
    toggleBlock(blockName);
  }, [blockName, toggleBlock]);

  return (
    <div
      ref={rootRef}
      className={cn(styles.dropdown, {
        [styles.wide]: isWideMenu,
      })}
    >
      <div className={styles.desktop}>
        <div
          className={cn(styles.control, {
            [styles.controlOpen]: open,
          })}
          onClick={handleToggle}
        >
          <div className={styles.text}>
            <div className={styles.title}>{filterName}</div>

            {!!selectedFiltersBy && <div className={styles.subtitle}>{selectedFiltersBy}</div>}
          </div>

          <div
            className={cn(styles.arrow, {
              [styles.arrowOpen]: open,
            })}
          >
            <SvgIcon icon="chevron" size={16} />
          </div>
        </div>

        <div
          className={cn(styles.menu, {
            [styles.menuOpen]: open,
            [styles.menuWide]: isWideMenu,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
