import type { TFilmFiltersProps } from './types';

import type { ReactNode } from 'react';

/** Идентификатор открытого дропдауна на странице фильмов (аккордеон). */
export type TFilterDropdownBlockId =
  | 'genres'
  | 'countries'
  | 'years'
  | 'rating'
  | 'grade'
  | 'producer'
  | 'actor';

/**
 * Пропсы выпадающего фильтра (FilterDropdown).
 *
 * Отвечает за отображение названия фильтра,
 * выбранных значений и контента выпадающего меню.
 */
export type TFilterDropdownProps = {
  /** Уникальный идентификатор блока фильтра (для управления состоянием открытия). */
  blockName: TFilterDropdownBlockId;

  /** Отображаемое название фильтра. */
  filterName: string;

  /** Текущее выбранное значение (или краткое описание выбора). */
  selectedFiltersBy: string | number;

  /** Контент выпадающего меню. */
  children: ReactNode;

  /** Флаг для отображения расширенного (широкого) меню. */
  isWideMenu?: boolean;
};

/**
 * Пропсы списка чекбоксов (широких и малых) для фильтров (жанры / страны / годы).
 *
 * @template T тип фильтра ('genres' | 'countries' | 'years')
 */
export type TFilterCheckboxListProps<T extends 'genres' | 'countries' | 'years'> = {
  /** Тип фильтра (определяет источник данных и поле обновления). */
  type: T;

  /** Все доступные значения фильтра. */
  allValues: TFilmFiltersProps['allFilters'][T];

  /** Текущие выбранные значения. */
  selectedValues: TFilmFiltersProps['selectedFilters'][T];

  /** Функция обновления фильтров. */
  onChange: TFilmFiltersProps['onUpdateFilters'];
};

/**
 * Пропсы слайдера диапазона (рейтинг / оценки).
 *
 * @template T тип фильтра ('rating' | 'grade')
 */
export type TRangeSliderProps<T extends 'rating' | 'grade'> = {
  /** Тип фильтра (определяет поле обновления). */
  type: T;

  /** Текущее значение фильтра. */
  selectedValue: TFilmFiltersProps['selectedFilters'][T];

  /** Функция обновления фильтров. */
  onChange: TFilmFiltersProps['onUpdateFilters'];
};

export type TPersonSearchingProps<T extends 'actor' | 'producer'> = {
  /** Тип фильтра (определяет поле обновления). */
  type: T;

  /** Текущее значение фильтра. */
  selectedValue: TFilmFiltersProps['selectedFilters'][T];

  /** Функция обновления фильтров. */
  onChange: TFilmFiltersProps['onUpdateFilters'];
};

export type TResetButtonProps = {
  selectedFilters: TFilmFiltersProps['selectedFilters'];
  onChange: TFilmFiltersProps['onUpdateFilters'];
};
