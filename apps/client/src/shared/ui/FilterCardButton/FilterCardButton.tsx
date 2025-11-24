'use client';

import React from 'react';
import styles from './FilterCardButton.module.scss';

interface FilterCardButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
}

export const FilterCardButton: React.FC<FilterCardButtonProps> = ({
  children,
  onClick,
  ariaLabel,
  className = '',
}) => {
  return (
    <div
      className={`${styles.card} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

