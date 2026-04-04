import type { TSortFilterProps } from '@/shared/ui';
import type { TFilmSortBy, TFiltersResponse, TSearchFilmsParams } from '@common/types';

/**
 * Выбранные пользователем значения: строки совпадают с API/URL (`genres`, `countries`),
 * годы — список лет премьеры (как OR в запросе).
 */
export type TFilmsFilters = {
  genres: string[];
  countries: string[];
  years: number[];
  rating: number;
  grade: number;
  producer: string;
  actor: string;
};

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
  /** Все возможные фильтры для установки значений (c сервера - жанры, страны, годы) */
  allFilters: TFiltersResponse;

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
 * Тип для пропсов компонента FilmsListToolbar.
 * Все возможные фильтры, выбранные фильтры, значение сортировки,
 * функция для обновления фильтров и функция для установки значения сортировки.
 */
export type TFilmsListToolbarProps = TExtendedFilmsFilterBase;

/**
 * Тип для пропсов компонента FilmsFilters.
 * Все возможные фильтры, выбранные фильтры и функция для обновления фильтров.
 */
export type TFilmFiltersProps = TFilmsFilterBase;
