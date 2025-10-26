import React, { useCallback, useMemo } from 'react';
import styles from './FilterRangeSlider.module.scss';

interface FilterRangeSliderProps {
  handleChangeFilter: (value: number) => void;
  blockName: 'rating' | 'grade';
  initialValue?: number;
}

// Конфигурация для разных типов слайдеров
const SLIDER_CONFIG = {
  rating: {
    max: 10,
    step: 0.1,
    min: 0,
    label: (value: number) => value.toString(),
    showMinMax: true,
    showCount: false
  },
  grade: {
    max: 999000,
    step: 9000,
    min: 0,
    label: (value: number) => (value / 1000).toString(),
    showMinMax: false,
    showCount: true
  }
} as const;

export const FilterRangeSlider: React.FC<FilterRangeSliderProps> = ({
  handleChangeFilter,
  blockName,
  initialValue = 0
}) => {
  // Получаем конфигурацию для текущего типа слайдера
  const config = SLIDER_CONFIG[blockName];
  
  // Мемоизируем расчет позиции bubble
  const bubblePosition = useMemo(() => {
    const percentage = ((initialValue - config.min) * 100) / (config.max - config.min);
    return `calc(${percentage}% + (${8 - percentage * 0.13}px))`;
  }, [initialValue, config.min, config.max]);
  
  // Мемоизируем стили для прогресс-бара
  const progressStyle = useMemo(() => ({
    backgroundSize: `${((initialValue - config.min) * 100) / (config.max - config.min)}% 100%`
  }), [initialValue, config.min, config.max]);
  
  // Простой обработчик изменений
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    // Исправляем проблемы с плавающей точкой
    const fixedValue = Math.round(newValue * 100) / 100;
    handleChangeFilter(fixedValue);
  }, [handleChangeFilter]);

  // Обработчик клика по полосе слайдера
  const handleClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newValue = config.min + (percentage * (config.max - config.min));
    
    // Округляем до ближайшего шага с правильным округлением
    const steppedValue = Math.round(newValue / config.step) * config.step;
    const clampedValue = Math.max(config.min, Math.min(config.max, steppedValue));
    
    // Исправляем проблемы с плавающей точкой
    const fixedValue = Math.round(clampedValue * 100) / 100;
    
    handleChangeFilter(fixedValue);
  }, [config.min, config.max, config.step, handleChangeFilter]);

  return (
    <div className={styles.rangeSlider}>
      <div className={styles.block}>
        <div className={styles.input}>
          <span
            className={styles.bubble}
            style={{ left: bubblePosition }}
          >
            {config.label(initialValue)}
          </span>
          <input
            type="range"
            value={initialValue}
            min={config.min}
            max={config.max}
            step={config.step}
            onChange={handleChange}
            onClick={handleClick}
            style={progressStyle}
          />
        </div>
        {config.showCount && (
          <div className={styles.count}>
            тыс.
          </div>
        )}
      </div>
      {config.showMinMax && (
        <div className={styles.minmax}>
          <span>{config.min}</span>
          <span>{config.max}</span>
        </div>
      )}
    </div>
  );
};
