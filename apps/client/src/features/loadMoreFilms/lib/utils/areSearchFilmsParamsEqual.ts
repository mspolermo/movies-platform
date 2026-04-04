import type { TSearchFilmsParams } from '@common/types';

const sortNums = (a: number[] | undefined) =>
  a === undefined ? undefined : [...a].sort((x, y) => x - y);
const sortStr = (a: string[] | undefined) =>
  a === undefined ? undefined : [...a].sort((x, y) => x.localeCompare(y));

/**
 * Сравнение параметров поиска без учёта ссылки на объект и порядка элементов в массивах.
 */
export const areSearchFilmsParamsEqual = (
  a: TSearchFilmsParams,
  b: TSearchFilmsParams
): boolean => {
  if (a === b) return true;

  return (
    a.page === b.page &&
    a.perPage === b.perPage &&
    a.sortBy === b.sortBy &&
    a.minRatingKp === b.minRatingKp &&
    a.minVotesKp === b.minVotesKp &&
    JSON.stringify(sortNums(a.years)) === JSON.stringify(sortNums(b.years)) &&
    JSON.stringify(sortStr(a.genres)) === JSON.stringify(sortStr(b.genres)) &&
    JSON.stringify(sortStr(a.countries)) === JSON.stringify(sortStr(b.countries)) &&
    JSON.stringify(sortStr(a.persons)) === JSON.stringify(sortStr(b.persons))
  );
};
