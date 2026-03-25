import type { TCountryItemResponse } from '@common/types';

export type TCountriesListProps = {
  isLoading: boolean;
  countriesList: TCountryItemResponse[];
};
