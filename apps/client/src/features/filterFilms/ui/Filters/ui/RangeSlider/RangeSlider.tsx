import type { TRangeSliderProps } from '../../../../model';

import styles from './RangeSlider.module.scss';
import { useRangeSliderFilter } from '../../../../lib';
import { FilterDropdown } from '../../../FilterDropdown';

/**
 * Слайдер «Рейтинг» или «Оценки» в фильтрах фильмов.
 * Логика debounce / синхронизации — {@link useRangeSliderFilter}.
 */
export const RangeSlider = <T extends 'rating' | 'grade'>(props: TRangeSliderProps<T>) => {
  const { type } = props;
  const {
    config,
    displayValue,
    bubblePosition,
    progressStyle,
    handleChange,
    handleClick,
    flushPendingPush,
  } = useRangeSliderFilter(props);

  return (
    <FilterDropdown
      blockName={type}
      filterName={type === 'rating' ? 'Рейтинг' : 'Оценки'}
      isWideMenu={false}
      selectedFiltersBy={displayValue}
    >
      <div className={styles.root}>
        <div className={styles.trackRow}>
          <div className={styles.trackShell}>
            <span className={styles.bubble} style={{ left: bubblePosition }}>
              {config.label(displayValue)}
            </span>
            <input
              className={styles.rangeInput}
              max={config.max}
              min={config.min}
              step={config.step}
              style={progressStyle}
              type="range"
              value={displayValue}
              onBlur={flushPendingPush}
              onChange={handleChange}
              onClick={handleClick}
              onPointerUp={flushPendingPush}
            />
          </div>
          {config.showCount && <span className={styles.unitSuffix}>тыс.</span>}
        </div>
        {config.showMinMax && (
          <div className={styles.scale}>
            <span>{config.min}</span>
            <span>{config.max}</span>
          </div>
        )}
      </div>
    </FilterDropdown>
  );
};
