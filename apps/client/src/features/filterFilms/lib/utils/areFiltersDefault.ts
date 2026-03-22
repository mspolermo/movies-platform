import type { ActiveFilters } from '../../types';

import { DEFAULT_ACTIVE_FILTERS } from '../../types';

/**
 * Проверяет, отличаются ли текущие фильтры от дефолтных
 */
export const areFiltersDefault = (filters: ActiveFilters): boolean =>
  Object.keys(DEFAULT_ACTIVE_FILTERS).every(
    (key) =>
      JSON.stringify(filters[key as keyof ActiveFilters]) ===
      JSON.stringify(DEFAULT_ACTIVE_FILTERS[key as keyof ActiveFilters])
  );
