'use client';

import type { TRangeSliderProps } from '../../model';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from 'react';

import {
  RANGE_SLIDER_CONFIG,
  RANGE_SLIDER_ON_CHANGE_DEBOUNCE_MS,
} from '@/features/filterFilms/constants';

/**
 * Локальное значение слайдера (мгновенный UI) и отложенное применение к фильтрам:
 * debounce + flush по pointerup/blur, без лишних запросов при перетаскивании.
 */
export const useRangeSliderFilter = <T extends 'rating' | 'grade'>({
  type,
  selectedValue,
  onChange,
}: TRangeSliderProps<T>) => {
  const config = RANGE_SLIDER_CONFIG[type];

  const [displayValue, setDisplayValue] = useState(selectedValue);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Совпадает с displayValue, но доступен синхронно при pointerup (до commit-рендера).
  const displayValueRef = useRef(selectedValue);
  // Последнее значение, которое считаем уже учтённым у родителя (дедуп одинаковых push).
  const syncedFromParentRef = useRef(selectedValue);

  // Родитель изменил фильтр (URL, сброс) — подтягиваем UI и отменяем отложенный push.
  useEffect(() => {
    syncedFromParentRef.current = selectedValue;
    displayValueRef.current = selectedValue;
    setDisplayValue(selectedValue);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, [selectedValue]);

  useEffect(
    () => () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    },
    []
  );

  const pushToParentIfNeeded = useCallback(
    (value: number) => {
      if (value === syncedFromParentRef.current) {
        return;
      }
      syncedFromParentRef.current = value;
      onChange({
        [type]: value,
      });
    },
    [onChange, type]
  );

  const schedulePushToParent = useCallback(
    (value: number) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        pushToParentIfNeeded(value);
      }, RANGE_SLIDER_ON_CHANGE_DEBOUNCE_MS);
    },
    [pushToParentIfNeeded]
  );

  const flushPendingPush = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    pushToParentIfNeeded(displayValueRef.current);
  }, [pushToParentIfNeeded]);

  // Позиция bubble и заливка трека считаются из одних данных — один useMemo.
  const { bubblePosition, progressStyle } = useMemo(() => {
    const span = config.max - config.min;
    const ratio = span === 0 ? 0 : (displayValue - config.min) / span;
    const percentage = ratio * 100;
    return {
      bubblePosition: `calc(${percentage}% + (${8 - percentage * 0.13}px))`,
      progressStyle: {
        backgroundSize: `${percentage}% 100%`,
      } as const,
    };
  }, [displayValue, config.min, config.max]);

  const applyLocalValue = useCallback(
    (raw: number) => {
      const fixedValue = Math.round(raw * 100) / 100;
      displayValueRef.current = fixedValue;
      setDisplayValue(fixedValue);
      schedulePushToParent(fixedValue);
    },
    [schedulePushToParent]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      applyLocalValue(Number(e.target.value));
    },
    [applyLocalValue]
  );

  // Клик по треку: явный пересчёт с привязкой к step (иногда надёжнее нативного шага при кастомном UI).
  const handleClick = useCallback(
    (e: MouseEvent<HTMLInputElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = rect.width === 0 ? 0 : clickX / rect.width;
      const newValue = config.min + ratio * (config.max - config.min);

      const steppedValue = Math.round(newValue / config.step) * config.step;
      const clampedValue = Math.max(config.min, Math.min(config.max, steppedValue));

      applyLocalValue(clampedValue);
    },
    [applyLocalValue, config.min, config.max, config.step]
  );

  return {
    config,
    displayValue,
    bubblePosition,
    progressStyle,
    handleChange,
    handleClick,
    flushPendingPush,
  };
};
