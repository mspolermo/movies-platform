import type { TButtonProps } from '../model';

import React, { forwardRef } from 'react';

import styles from './Button.module.scss';

export const Button = forwardRef<HTMLButtonElement, TButtonProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      disabled = false,
      loading = false,
      children,
      icon,
      className = '',
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      disabled && styles['button--disabled'],
      loading && styles['button--loading'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        type={type}
        onClick={handleClick}
        {...props}
      >
        {loading && <div className={styles.button__spinner} />}

        {icon && <span className={styles.button__icon}>{icon}</span>}

        {children && <span className={styles.button__content}>{children}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
