// features/professions/tabs/ui/ProfessionsTabs/ProfessionsTabs.tsx
'use client';

import React from 'react';
import cn  from 'classnames';
import { useScrollArrows } from '../../lib';
import styles from './ProfessionsSlider.module.scss';
import { SvgIcon } from '@/shared/ui';
import { TProfessionsTabsProps } from './types';
import { capitalizeFirst } from '@/shared/lib';

/**
 * UI слайдер профессий для выбора профессии
 *
 */
export const ProfessionsSlider = ({ professions, activeProfessionId, onProfessionChange }: TProfessionsTabsProps) => {
  const {
    containerRef,
    tabsRef,
    showLeft,
    showRight,
    hoverLeft,
    hoverRight,
    onMouseMove,
    onMouseLeave,
    scrollLeft,
    scrollRight,
  } = useScrollArrows(professions, activeProfessionId);

  return (
    <div ref={containerRef} className={styles.container} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div ref={tabsRef} className={styles.tabs}>
        {professions.map((p) => {
          const isActive = activeProfessionId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onProfessionChange(p.id)}
              aria-pressed={isActive}
              aria-label={`Выбрать профессию ${p.name}`}
              className={cn(styles.tab, isActive && styles.tabActive)}
            >
              {capitalizeFirst(p.name)}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={scrollLeft}
        disabled={!showLeft}
        aria-label="Прокрутить влево"
        className={cn(styles.arrowButton, hoverLeft && styles.visible)}
      >
        <SvgIcon name="arrow-left" size={24} />
      </button>

      <button
        type="button"
        onClick={scrollRight}
        disabled={!showRight}
        aria-label="Прокрутить вправо"
        className={cn(styles.arrowButton, styles.arrowButtonRight, hoverRight && styles.visible)}
      >
        <SvgIcon name="arrow-right" size={24} />
      </button>
    </div>
  );
};
