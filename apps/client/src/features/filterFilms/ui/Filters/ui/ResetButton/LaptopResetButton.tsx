import type { TResetButtonProps } from '../../../../model';

import { useCallback } from 'react';

import { SvgIcon } from '@/shared/ui';

import styles from './styles/LaptopResetButton.module.scss';
import { DEFAULT_FILTERS } from '../../../../constants';
import { areFiltersDefault } from '../../../../lib';

export const LaptopResetButton = ({ selectedFilters, onChange }: TResetButtonProps) => {
  const isDisabled = areFiltersDefault(selectedFilters);

  const handleReset = useCallback(() => {
    onChange(DEFAULT_FILTERS);
  }, [onChange]);

  return (
    <div className={styles.root}>
      <button className={styles.button} disabled={isDisabled} type="button" onClick={handleReset}>
        <span className={styles.icon}>
          <SvgIcon icon="close" size={20} />
        </span>

        <span className={styles.text}>Сбросить фильтры</span>
      </button>
    </div>
  );
};
