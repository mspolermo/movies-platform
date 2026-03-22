import type { ButtonProps } from './types';

import React, { forwardRef } from 'react';

import styles from './Button.module.scss';

/**
 * Универсальный компонент кнопки с поддержкой различных стилей, размеров и состояний
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      disabled = false,
      loading = false,
      children,
      icon,
      iconPosition = 'left',
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

        {icon && iconPosition === 'left' && (
          <span className={styles.button__icon}>{icon}</span>
        )}

        {children && <span className={styles.button__content}>{children}</span>}

        {icon && iconPosition === 'right' && (
          <span className={styles.button__icon}>{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
