'use client';

import type { TInputProps } from '../model';

import React, { forwardRef, useEffect, useState, useId } from 'react';

import styles from './Input.module.scss';

export const Input = forwardRef<HTMLInputElement, TInputProps>(
  (
    {
      label,
      placeholder,
      error,
      disabled = false,
      required = false,
      clearable = false,
      onClear,
      className = '',
      size = 'medium',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
    const inputId = useId();

    /** Контролируемое значение: держим hasValue вместе с value из пропсов (иначе крестик не совпадает с полем). */
    useEffect(() => {
      if (props.value !== undefined) {
        setHasValue(Boolean(props.value));
      }
    }, [props.value]);

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

    const showClearButton = clearable && !disabled && hasValue;

    const inputClasses = [
      styles.input,
      styles[`input--${size}`],
      isFocused && styles['input--focused'],
      error && styles['input--error'],
      disabled && styles['input--disabled'],
      !label && styles['input--no-label'],
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
            <label className={labelClasses} htmlFor={inputId}>
              {label}
              {required && <span className={styles.input__required}>*</span>}
            </label>
          )}

          <input
            ref={ref}
            className={styles.input__field}
            disabled={disabled}
            id={inputId}
            placeholder={
              label ? (isFocused || hasValue ? '' : placeholder) : hasValue ? '' : placeholder
            }
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            {...props}
          />

          {showClearButton && (
            <button
              aria-label="Очистить"
              className={styles.input__clear}
              tabIndex={-1}
              type="button"
              onClick={handleClear}
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
