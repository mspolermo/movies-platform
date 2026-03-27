'use client';

import type { TProfessionsTabsProps } from './types';

import cn from 'classnames';
import React from 'react';

import { capitalizeFirst } from '@/shared/lib';
import { SvgIcon } from '@/shared/ui';

import styles from './ProfessionsSlider.module.scss';
import { useScrollArrows } from '../../lib';

/**
 * UI слайдер профессий для выбора профессии
 *
 */
export const ProfessionsSlider = ({
  professions,
  activeProfessionId,
  onProfessionChange,
}: TProfessionsTabsProps) => {
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
    <div
      ref={containerRef}
      className={styles.container}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <div ref={tabsRef} className={styles.tabs}>
        {professions.map((p) => {
          const isActive = activeProfessionId === p.id;
          return (
            <button
              key={p.id}
              aria-label={`Выбрать профессию ${p.name}`}
              aria-pressed={isActive}
              className={cn(styles.tab, isActive && styles.tabActive)}
              type="button"
              onClick={() => onProfessionChange(p.id)}
            >
              {capitalizeFirst(p.name)}
            </button>
          );
        })}
      </div>

      <button
        aria-label="Прокрутить влево"
        className={cn(styles.arrowButton, hoverLeft && styles.visible)}
        disabled={!showLeft}
        type="button"
        onClick={scrollLeft}
      >
        <SvgIcon name="arrow-left" size={24} />
      </button>

      <button
        aria-label="Прокрутить вправо"
        className={cn(styles.arrowButton, styles.arrowButtonRight, hoverRight && styles.visible)}
        disabled={!showRight}
        type="button"
        onClick={scrollRight}
      >
        <SvgIcon name="arrow-right" size={24} />
      </button>
    </div>
  );
};
