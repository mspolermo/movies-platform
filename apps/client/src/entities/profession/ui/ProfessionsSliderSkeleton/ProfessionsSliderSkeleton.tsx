'use client';

import { Skeleton } from '@/shared/ui';

import styles from './ProfessionsSliderSkeleton.module.scss';
import sliderStyles from '../ProfessionsSlider/ProfessionsSlider.module.scss';

const CHIP_WIDTHS = [92, 128, 76, 140, 84, 110, 96] as const;

/**
 * Плейсхолдер ряда табов профессий при навигационной загрузке.
 */
export const ProfessionsSliderSkeleton = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Загрузка фильтра профессий"
      className={sliderStyles.wrapper}
      role="status"
    >
      <div className={sliderStyles.tabs}>
        {CHIP_WIDTHS.map((width, index) => (
          <div key={index} className={styles.chip}>
            <Skeleton
              animation="pulse"
              borderRadius={4}
              height={20}
              variant="rectangular"
              width={width}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
