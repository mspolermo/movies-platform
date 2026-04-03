import type { TCountryItemResponse, TGenreItemResponse } from '@common/types';

/**
 * Возвращает отображаемое название элемента (жанр или страна).
 */
export const getCheckboxLabel = (item: TGenreItemResponse | TCountryItemResponse): string => {
  return 'countryName' in item ? item.countryName : item.nameRu;
};
