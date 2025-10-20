import React, { forwardRef, useState, useId } from 'react';
import { InputProps } from './types';
import styles from './Input.module.scss';

/**
 * Универсальный компонент поля ввода с поддержкой различных состояний и стилей
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      error,
      disabled = false,
      required = false,
      icon,
      iconPosition = 'left',
      clearable = false,
      onClear,
      className = '',
      variant = 'default',
      size = 'medium',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      !!props.value || !!props.defaultValue
    );
    const inputId = useId();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const handleClear = () => {
      if (onClear) {
        onClear();
        setHasValue(false);
      }
    };

    const inputClasses = [
      styles.input,
      styles[`input--${variant}`],
      styles[`input--${size}`],
      isFocused && styles['input--focused'],
      error && styles['input--error'],
      disabled && styles['input--disabled'],
      icon && iconPosition === 'left' && styles['input--with-left-icon'],
      icon && iconPosition === 'right' && styles['input--with-right-icon'],
      clearable && styles['input--clearable'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const labelClasses = [
      styles.input__label,
      isFocused && styles['input__label--focused'],
      hasValue && styles['input__label--has-value'],
      error && styles['input__label--error'],
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.inputWrapper}>
        <div className={inputClasses}>
          {label && (
            <label htmlFor={inputId} className={labelClasses}>
              {label}
              {required && <span className={styles.input__required}>*</span>}
            </label>
          )}

          {icon && iconPosition === 'left' && (
            <div className={styles.input__icon}>{icon}</div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={styles.input__field}
            placeholder={isFocused || hasValue ? '' : placeholder}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className={styles.input__icon}>{icon}</div>
          )}

          {clearable && hasValue && !disabled && (
            <button
              type="button"
              className={styles.input__clear}
              onClick={handleClear}
              tabIndex={-1}
            >
              ×
            </button>
          )}
        </div>

        {error && <div className={styles.input__error}>{error}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';
