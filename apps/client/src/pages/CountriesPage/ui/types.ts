import type { TCountryBased } from '@common/types';

export type TCountriesPageProps =
  | {
      isLoading: true;
      countriesList?: never;
    }
  | {
      isLoading?: false;
      countriesList: TCountryBased[];
    };
