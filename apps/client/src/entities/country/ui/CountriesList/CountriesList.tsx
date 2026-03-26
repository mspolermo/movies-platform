import type { TCountriesListProps } from './types';

import { Skeleton } from '@/shared/ui';

import styles from './CountriesList.module.scss';
import { CountryCard } from '../CountryCard';

/**
 * Список стран.
 * Отображает список стран, загрузку и пустое состояние.
 */
export const CountriesList = ({ isLoading, countriesList }: TCountriesListProps) => {
  if (isLoading)
    return (
      <div className={styles.countriesGrid}>
        {[...Array(20)].map((_, i) => (
          <Skeleton key={i} height={70} width={220} />
        ))}
      </div>
    );

  if (countriesList.length === 0)
    return (
      <div className={styles.countriesGrid}>
        <div className={styles.emptyState}>Страны не найдены</div>
      </div>
    );

  return (
    <div className={styles.countriesGrid}>
      {countriesList.map((country, id) => (
        <CountryCard key={`${country.countryName}-${id}`} country={country} />
      ))}
    </div>
  );
};
