import type { TCountryListResponse } from '@common/types';

export type TCountriesPageProps =
  | {
      isLoading: true;
      countriesList?: never;
    }
  | {
      isLoading?: false;
      countriesList: TCountryListResponse;
    };
