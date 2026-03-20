import { FilterCardButton, Loader } from "@/shared/ui";
import { TCountryCardProps } from "./types";
import styles from './CountryCard.module.scss';
import Link from "next/link";

/**
 * Карточка страны.
 * Отображает название страны и обрабатывает выбор.
 */
export const CountryCard = ({ country }: TCountryCardProps) => {
const { countryName } = country;

  return (
    <Link href={`/films?countries=${countryName}`}>
      <FilterCardButton
        ariaLabel={`Открыть фильмы страны ${countryName}`}
      >
        <h3 className={styles.countryName}>{countryName}</h3>
      </FilterCardButton>
    </Link>
  )
}