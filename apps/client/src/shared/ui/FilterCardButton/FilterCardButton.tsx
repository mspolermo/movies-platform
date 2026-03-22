'use client';

import React from 'react';

import styles from './FilterCardButton.module.scss';

interface FilterCardButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}

/**
 * Универсальная карточка-кнопка.
 * Используется для кликабельных элементов с кастомным UI.
 * Поддерживает управление с клавиатуры (Enter / Space).
 */
export const FilterCardButton = ({
  children,
  onClick,
  ariaLabel,
  className = '',
}: FilterCardButtonProps) => {
  return (
    <div
      aria-label={ariaLabel}
      className={`${styles.card} ${className}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {children}
    </div>
  );
};
