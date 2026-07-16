'use client';

import type { TProfessionsTabsProps } from './types';

import cn from 'classnames';
import React, { useEffect, useMemo, useRef } from 'react';

import { capitalizeFirst } from '@/shared/lib';
import { HorizontalCarousel, type THorizontalCarouselHandle } from '@/shared/ui';

import styles from './ProfessionsSlider.module.scss';

/**
 * UI слайдер профессий для выбора профессии
 *
 */
export const ProfessionsSlider = ({
  professions,
  activeProfessionId,
  onProfessionChange,
}: TProfessionsTabsProps) => {
  const carouselRef = useRef<THorizontalCarouselHandle>(null);

  const activeIndex = useMemo(() => {
    if (activeProfessionId === null) {
      return -1;
    }

    return professions.findIndex((profession) => profession.id === activeProfessionId);
  }, [activeProfessionId, professions]);

  useEffect(() => {
    if (activeIndex === -1) {
      return;
    }

    carouselRef.current?.scrollToIndex(activeIndex);
  }, [activeIndex]);

  return (
    <HorizontalCarousel
      ref={carouselRef}
      arrows="auto"
      className={styles.wrapper}
      scrollStep={200}
      snapType="none"
      trackClassName={styles.tabs}
    >
      {professions.map((profession) => {
        const isActive = activeProfessionId === profession.id;

        return (
          <button
            key={profession.id}
            aria-label={`Выбрать профессию ${profession.name}`}
            aria-pressed={isActive}
            className={cn(styles.tab, isActive && styles.tabActive)}
            type="button"
            onClick={() => onProfessionChange(profession.id)}
          >
            {capitalizeFirst(profession.name)}
          </button>
        );
      })}
    </HorizontalCarousel>
  );
};
