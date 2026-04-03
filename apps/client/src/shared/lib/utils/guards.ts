import type { TFilmSortBy } from '@common/types';

import { SORT_LABELS } from '@/shared/constants';

/**
 * Проверяет, что значение является допустимым вариантом сортировки.
 */
export const isSortOption = (key: string): key is TFilmSortBy => {
  return key in SORT_LABELS;
};
