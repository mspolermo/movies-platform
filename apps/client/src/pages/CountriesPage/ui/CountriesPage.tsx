'use client';

import type { TCountriesPageProps } from './types';

import { CountryCard } from '@/entities/country';
import { Skeleton } from '@/shared/ui';
import { Page } from '@/widgets/Layout';

import styles from './CountriesPage.module.scss';

export const CountriesPage = ({
  isLoading,
  countriesList,
}: TCountriesPageProps) => {
  if (isLoading)
    return (
      <Page title="Страны">
        <div className={styles.countriesGrid}>
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} height={70} width={220} />
          ))}
        </div>
      </Page>
    );

  return (
    <Page title="Страны">
      <div className={styles.countriesGrid}>
        {countriesList.map((country) => (
          <CountryCard key={country.id} country={country} />
        ))}
      </div>
    </Page>
  );
};
