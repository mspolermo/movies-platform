'use client';

import type { TSelectProps } from '../model';

import { useId } from 'react';

import styles from './Select.module.scss';

/**
 * Селект в стиле Input: одиночный (`<select>`) или множественный (чекбокс-лист).
 * Нативный множественный select не используем — белый скроллбар и системный вид.
 */
export const Select = (props: TSelectProps) => {
  const autoId = useId();
  const fieldId = ('id' in props && props.id) || autoId;

  const wrapperClass = [
    styles.wrapper,
    styles[`wrapper--${props.size ?? 'medium'}`],
    props.error && styles['wrapper--error'],
    props.disabled && styles['wrapper--disabled'],
    props.className,
  ]
    .filter(Boolean)
    .join(' ');

  if (props.multiple) {
    const {
      label,
      options,
      error,
      disabled = false,
      required = false,
      placeholder,
      value,
      onChange,
      visibleRows,
      name,
    } = props;
    const selected = new Set(value);
    const rows = visibleRows ?? Math.min(6, Math.max(3, options.length));

    const toggle = (nextValue: string) => {
      if (disabled) return;
      const next = selected.has(nextValue)
        ? value.filter((v) => v !== nextValue)
        : [...value, nextValue];
      onChange(next);
    };

    return (
      <div className={wrapperClass}>
        {label && (
          <span className={styles.label} id={`${fieldId}-label`}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </span>
        )}
        <div
          aria-labelledby={label ? `${fieldId}-label` : undefined}
          className={styles.multi}
          id={fieldId}
          role="group"
          style={{ maxHeight: `${rows * 36}px` }}
        >
          {options.length === 0 ? (
            <p className={styles.empty}>{placeholder ?? 'Нет вариантов'}</p>
          ) : (
            options.map((opt) => {
              const checked = selected.has(opt.value);
              const optDisabled = disabled || Boolean(opt.disabled);

              return (
                <label
                  key={opt.value}
                  className={[styles.option, checked && styles['option--checked']]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <input
                    checked={checked}
                    className={styles.checkbox}
                    disabled={optDisabled}
                    name={name}
                    type="checkbox"
                    value={opt.value}
                    onChange={() => toggle(opt.value)}
                  />
                  <span className={styles.optionLabel}>{opt.label}</span>
                </label>
              );
            })
          )}
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    );
  }

  const {
    label,
    options,
    error,
    disabled = false,
    required = false,
    placeholder,
    value,
    onChange,
    size: _size,
    className: _className,
    multiple: _multiple,
    ...selectAttrs
  } = props;

  return (
    <div className={wrapperClass}>
      {label && (
        <label className={styles.label} htmlFor={fieldId}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.control}>
        <select
          {...selectAttrs}
          className={styles.native}
          disabled={disabled}
          id={fieldId}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {placeholder != null && (
            <option disabled value="">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} disabled={opt.disabled} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span aria-hidden className={styles.chevron} />
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};
