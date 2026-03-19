import { Loader, FilterCardButton } from '@/shared/ui';
import { useAllGenres } from '../lib';
import styles from './AllGenres.module.scss';

export const AllGenres = () => {
  const { loading, error, genres, handleGenreClick } = useAllGenres()

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader size="small" />
      </div>
    );
  }

  if (true) {
    return (
      <div className={styles.error}>{error}</div>
    );
  }

  return (
    <div className={styles.genresGrid}>
      {genres.map((genre) => (
        <FilterCardButton
          key={genre.id}
          onClick={() => handleGenreClick(genre.nameRu)}
          ariaLabel={`Открыть фильмы жанра ${genre.nameRu}`}
        >
          <h3 className={styles.genreName}>{genre.nameRu}</h3>
          {genre.nameEn && (
            <p className={styles.genreDescription}>{genre.nameEn}</p>
          )}
        </FilterCardButton>
      ))}
    </div>
  );
}