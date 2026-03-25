import type { SortOption } from '../../types';

import React, { useState } from 'react';

import { SvgIcon } from '@/shared/ui';

import styles from './SortFilter.module.scss';
import { SORT_OPTIONS } from '../../types';

interface SortFilterProps {
  sortValue: SortOption;
  setSortValue: (value: SortOption) => void;
}

const sortLabels: Record<SortOption, string> = {
  popularity: 'По популярности',
  rating: 'По рейтингу',
  novelty: 'По новизне',
  alphabet: 'По алфавиту',
};

export const SortFilter = ({ sortValue, setSortValue }: SortFilterProps) => {
  const [active, setActive] = useState(false);

  const handleOptionClick = (option: SortOption) => {
    setSortValue(option);
    setActive(false);
  };

  return (
    <div className={styles.sortFilter}>
      <div className={styles.content}>
        <div className={styles.block}>
          <div className={styles.select} onClick={() => setActive((v) => !v)}>
            <div className={styles.active}>
              <div className={styles.icon}>
                <SvgIcon name="sort" size={16} />
              </div>

              <div className={styles.title}>{sortLabels[sortValue]}</div>

              <div className={`${styles.arrow} ${active ? styles.arrowUp : styles.arrowDown}`}>
                <SvgIcon name="chevron" size={20} />
              </div>
            </div>
          </div>

          {active && (
            <>
              <div className={styles.closeBlock} onClick={() => setActive(false)} />

              <div className={styles.value}>
                <div className={styles.subtitle}>Сортировка</div>

                {SORT_OPTIONS.map((option) => (
                  <div
                    key={option}
                    className={`${styles.option} ${option === sortValue ? styles.optionActive : ''}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {sortLabels[option]}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
