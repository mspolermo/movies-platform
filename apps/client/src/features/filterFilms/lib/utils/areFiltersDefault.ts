import { DEFAULT_FILTERS, type TFilmsFilters } from '../../model';

/**
 * Проверяет, отличаются ли текущие фильтры от дефолтных
 */
export const areFiltersDefault = (filters: TFilmsFilters): boolean =>
  Object.keys(DEFAULT_FILTERS).every(
    (key) =>
      JSON.stringify(filters[key as keyof TFilmsFilters]) ===
      JSON.stringify(DEFAULT_FILTERS[key as keyof TFilmsFilters])
  );
