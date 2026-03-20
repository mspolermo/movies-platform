import { FilterCardButton, Loader } from "@/shared/ui";
import { TGenreCardProps } from "./types";
import styles from './GenreCard.module.scss';
import Link from "next/link";

/**
 * Карточка жанра.
 * Отображает названия жанра (Ru, en) и обрабатывает выбор.
 */
export const GenreCard = ({ genre }: TGenreCardProps) => {
const { nameRu, nameEn } = genre;

  return (
    <Link href={`/films?genres=${nameRu}`}>
      <FilterCardButton
        ariaLabel={`Открыть фильмы жанра ${nameRu}`}
      >
        <h3 className={styles.genreName}>{nameRu}</h3>
        {genre.nameEn && (
          <p className={styles.genreDescription}>{nameEn}</p>
        )}
      </FilterCardButton>
    </Link>
  )
}