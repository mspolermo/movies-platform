import type { TRangeSliderProps } from '../../../../model';

import { useCallback, useMemo, type ChangeEvent, type MouseEvent } from 'react';

import { RANGE_SLIDER_CONFIG } from '@/features/filterFilms/constants';

import styles from './RangeSlider.module.scss';
import { FilterDropdown } from '../FilterDropdown';

export const RangeSlider = <T extends 'rating' | 'grade'>({
  type,
  selectedValue,
  onChange,
}: TRangeSliderProps<T>) => {
  // Получаем конфигурацию для текущего типа слайдера
  const config = RANGE_SLIDER_CONFIG[type];

  // Мемоизируем расчет позиции bubble
  const bubblePosition = useMemo(() => {
    const percentage = ((selectedValue - config.min) * 100) / (config.max - config.min);
    return `calc(${percentage}% + (${8 - percentage * 0.13}px))`;
  }, [selectedValue, config.min, config.max]);

  // Мемоизируем стили для прогресс-бара
  const progressStyle = useMemo(
    () => ({
      backgroundSize: `${((selectedValue - config.min) * 100) / (config.max - config.min)}% 100%`,
    }),
    [selectedValue, config.min, config.max]
  );

  // Простой обработчик изменений
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      // Исправляем проблемы с плавающей точкой
      const fixedValue = Math.round(newValue * 100) / 100;
      onChange({
        [type]: fixedValue,
      });
    },
    [onChange, type]
  );

  // Обработчик клика по полосе слайдера
  const handleClick = useCallback(
    (e: MouseEvent<HTMLInputElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newValue = config.min + percentage * (config.max - config.min);

      // Округляем до ближайшего шага с правильным округлением
      const steppedValue = Math.round(newValue / config.step) * config.step;
      const clampedValue = Math.max(config.min, Math.min(config.max, steppedValue));

      // Исправляем проблемы с плавающей точкой
      const fixedValue = Math.round(clampedValue * 100) / 100;

      onChange({
        [type]: fixedValue,
      });
    },
    [config.min, config.max, config.step, onChange, type]
  );

  return (
    <FilterDropdown
      blockName={type}
      filterName={type === 'rating' ? 'Рейтинг' : 'Оценки'}
      isWideMenu={false}
      selectedFiltersBy={selectedValue}
    >
      <div className={styles.rangeFilter}>
        <div className={styles.block}>
          <div className={styles.input}>
            <span className={styles.bubble} style={{ left: bubblePosition }}>
              {config.label(selectedValue)}
            </span>
            <input
              max={config.max}
              min={config.min}
              step={config.step}
              style={progressStyle}
              type="range"
              value={selectedValue}
              onChange={handleChange}
              onClick={handleClick}
            />
          </div>
          {config.showCount && <div className={styles.count}>тыс.</div>}
        </div>
        {config.showMinMax && (
          <div className={styles.minmax}>
            <span>{config.min}</span>
            <span>{config.max}</span>
          </div>
        )}
      </div>
    </FilterDropdown>
  );
};
