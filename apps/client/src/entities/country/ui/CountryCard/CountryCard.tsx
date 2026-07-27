import type { TCountryCardProps } from './types';

import Link from 'next/link';

import { FilterCardButton } from '@/shared/ui';

import styles from './CountryCard.module.scss';

/**
 * Карточка страны.
 * Отображает название страны и обрабатывает выбор.
 */
export const CountryCard = ({ country }: TCountryCardProps) => {
  const { countryName } = country;

  return (
    <Link href={`/films?countries=${countryName}`}>
      <FilterCardButton>
        <h3 className={styles.countryName}>{countryName}</h3>
      </FilterCardButton>
    </Link>
  );
};
