import type { TResetButtonProps } from '../../../../model';

import { useCallback } from 'react';

import styles from './styles/MobileResetButton.module.scss';
import { DEFAULT_FILTERS } from '../../../../constants';
import { areFiltersDefault } from '../../../../lib';

export const MobileResetButton = ({ selectedFilters, onChange }: TResetButtonProps) => {
  const isDisabled = areFiltersDefault(selectedFilters);

  const handleReset = useCallback(() => {
    onChange(DEFAULT_FILTERS);
  }, [onChange]);

  return (
    <div className={styles.root}>
      <button className={styles.button} disabled={isDisabled} type="button" onClick={handleReset}>
        Сбросить фильтры
      </button>
    </div>
  );
};
