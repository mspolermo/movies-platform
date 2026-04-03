import type { TAllFilmsFilters, TFilmsFilters } from './filters';
import type { TSortFilterProps } from '@/shared/ui';
import type { TFilmSortBy, TSearchFilmsParams } from '@common/types';

/**
 * Базовый тип для компонентов сортировки.
 * Наследуется от пропсов компонента сортировки, который уже
 * работает с фиксированными опциями сортировки.
 */
type TFilmsSortingsBase = TSortFilterProps;

/**
 * * Базовый тип для компонентов фильтров.
 */
type TFilmsFilterBase = {
  /** Все возможные фильтры для установки значений */
  allFilters: TAllFilmsFilters;

  /** Выбранные фильтры. */
  selectedFilters: TFilmsFilters;
  /** Функция для обновления фильтров. */
  onUpdateFilters: (updates: Partial<TFilmsFilters>) => void;
};

/**
 * Расширенный базовый тип для компонентов фильтров.
 * Наследуется от базового типа фильтров и базового типа сортировки.
 */
type TExtendedFilmsFilterBase = TFilmsFilterBase & TFilmsSortingsBase;

/**
 *  Возвращаемый тип для хука useFilters.
 *  Фильтры, сортировка и параметры для запроса фильмов.
 */
export type TUseFiltersReturn = Omit<TExtendedFilmsFilterBase, 'allFilters'> & {
  searchFilmsParams: TSearchFilmsParams;
};

/**
 * Тип для опций хука useFilters.
 * Изначально выбранные фильтры и сортировка.
 */
export type TUseFiltersOptions = {
  initialFilters: TFilmsFilters;
  initialSort: TFilmSortBy;
};

/**
 * Тип для пропсов компонента FilmsFilter.
 * Все возможные фильтры, выбранные фильтры, значение сортировки,
 * функция для обновления фильтров и функция для установки значения сортировки.
 */
export type TFilmsSortingFilterProps = TExtendedFilmsFilterBase;

/**
 * Тип для пропсов компонента FilmsFilters.
 * Все возможные фильтры, выбранные фильтры и функция для обновления фильтров.
 */
export type TFilmFiltersProps = TFilmsFilterBase;
