'use client';

import type { TSortFilterProps } from './types';
import type { TFilmSortBy } from '@common/types';

import cn from 'classnames';
import React, { useState } from 'react';

import { SORT_LABELS } from '@/shared/constants';
import { isSortOption } from '@/shared/lib';
import { SvgIcon } from '@/shared/ui';

import styles from './SortFilter.module.scss';

/**
 * SortFilter — выпадающий список выбора сортировки фильмов.
 *
 * @param selectedSort текущий выбранный тип сортировки
 * @param onUpdateSort колбэк при выборе новой сортировки
 *
 * UX:
 * - открывается по клику на trigger
 * - закрывается при выборе опции или клике вне (overlay)
 */
export const SortFilter = ({ selectedSort, onUpdateSort }: TSortFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: TFilmSortBy) => {
    onUpdateSort(option);
    setIsOpen(false);
  };

  const SORT_OPTIONS = Object.keys(SORT_LABELS).filter(isSortOption);

  return (
    <div className={styles.root}>
      <button
        className={cn(styles.trigger, isOpen && styles.triggerOpen)}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
      >
        <SvgIcon name="sort" size={16} />

        <span className={styles.label}>{SORT_LABELS[selectedSort]}</span>

        <SvgIcon
          className={cn(styles.chevron, isOpen && styles.chevronOpen)}
          name="chevron"
          size={20}
        />
      </button>

      {isOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />

          <div className={styles.dropdown}>
            <div className={styles.heading}>Сортировка</div>

            {SORT_OPTIONS.map((option) => (
              <button
                key={option}
                className={cn(styles.option, option === selectedSort && styles.optionSelected)}
                type="button"
                onClick={() => handleSelect(option)}
              >
                {SORT_LABELS[option]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
