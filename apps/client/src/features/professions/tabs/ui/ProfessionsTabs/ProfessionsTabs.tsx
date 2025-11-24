'use client';

import React, { useRef, useState, useEffect } from 'react';
import { TProfessionBased } from '@common/types';
import styles from './ProfessionsTabs.module.scss';

interface ProfessionsTabsProps {
  professions: TProfessionBased[];
  activeProfessionId: number | null;
  onProfessionChange: (professionId: number) => void;
}

const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const ProfessionsTabs: React.FC<ProfessionsTabsProps> = ({
  professions,
  activeProfessionId,
  onProfessionChange,
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);

  const checkScrollButtons = () => {
    if (!tabsRef.current) return;

    // Используем requestAnimationFrame для более точного определения размеров
    requestAnimationFrame(() => {
      if (!tabsRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      const canScroll = scrollWidth > clientWidth;
      const tolerance = 1; // Небольшая погрешность для учета округления
      
      setShowLeftArrow(canScroll && scrollLeft > tolerance);
      setShowRightArrow(canScroll && scrollLeft < scrollWidth - clientWidth - tolerance);
    });
  };

  useEffect(() => {
    // Проверяем после рендера с небольшой задержкой, чтобы DOM успел обновиться
    const timeoutId = setTimeout(() => {
      checkScrollButtons();
    }, 0);

    const tabsElement = tabsRef.current;
    if (tabsElement) {
      tabsElement.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
    }
    return () => {
      clearTimeout(timeoutId);
      if (tabsElement) {
        tabsElement.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [professions]);

  // Дополнительная проверка после изменения размера контента
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      checkScrollButtons();
    });

    if (tabsRef.current) {
      observer.observe(tabsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [professions]);

  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const scrollToActive = () => {
    if (!tabsRef.current || activeProfessionId === null) return;

    const activeIndex = professions.findIndex((p) => p.id === activeProfessionId);
    if (activeIndex === -1) return;

    const activeButton = tabsRef.current.children[activeIndex] as HTMLElement;
    if (activeButton) {
      const containerWidth = tabsRef.current.clientWidth;
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const scrollPosition = buttonLeft - containerWidth / 2 + buttonWidth / 2;

      tabsRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToActive();
  }, [activeProfessionId, professions]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const edgeThreshold = 80; // Расстояние от края, при котором показываются стрелки
    
    setHoverLeft(x < edgeThreshold && showLeftArrow);
    setHoverRight(x > width - edgeThreshold && showRightArrow);
  };

  const handleMouseLeave = () => {
    setHoverLeft(false);
    setHoverRight(false);
  };

  return (
    <div 
      ref={containerRef}
      className={styles.container}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={tabsRef} className={styles.tabs}>
        {professions.map((profession) => (
          <button
            key={profession.id}
            type="button"
            className={`${styles.tab} ${activeProfessionId === profession.id ? styles.tabActive : ''}`}
            onClick={() => onProfessionChange(profession.id)}
            aria-label={`Выбрать профессию ${profession.name}`}
            aria-pressed={activeProfessionId === profession.id}
          >
            {capitalizeFirstLetter(profession.name)}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={`${styles.arrowButton} ${showLeftArrow && hoverLeft ? styles.visible : ''}`}
        onClick={scrollLeft}
        aria-label="Прокрутить влево"
        disabled={!showLeftArrow}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className={`${styles.arrowButton} ${styles.arrowButtonRight} ${showRightArrow && hoverRight ? styles.visible : ''}`}
        onClick={scrollRight}
        aria-label="Прокрутить вправо"
        disabled={!showRightArrow}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

