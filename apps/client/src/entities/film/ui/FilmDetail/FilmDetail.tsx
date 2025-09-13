import { TFilmBased } from '@common/types';
import styles from './FilmDetail.module.scss';
import { FilmDetailProps } from '../types';

export const FilmDetail = (props: FilmDetailProps) => {
    const { film } = props;

    const formatRating = (rating?: number) => {
      if (!rating) return '0.0';
      return rating.toFixed(1);
    };
  
    const formatDuration = (minutes?: number) => {
      if (!minutes) return '';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}ч ${mins}мин` : `${mins}мин`;
    };
  
    const formatDate = (date?: Date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('ru-RU');
    };


    return (
      <div className={styles.container}>
      <div className={styles.filmDetail}>
        <div className={styles.posterSection}>
          <img 
            src={film.bigPictureUrl || film.smallPictureUrl || '/placeholder-film.jpg'} 
            alt={film.filmNameRu}
            className={styles.poster}
          />
        </div>
        
        <div className={styles.infoSection}>
          <h1 className={styles.title}>
            {film.filmNameRu}
          </h1>
          
          {film.filmNameEn && (
            <h2 className={styles.titleEn}>
              {film.filmNameEn}
            </h2>
          )}

          {film.slogan && (
            <p className={styles.slogan}>
              {film.slogan}
            </p>
          )}

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Год:</span>
              <span className={styles.metaValue}>{film.year}</span>
            </div>
            
            {film.movieLength && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Длительность:</span>
                <span className={styles.metaValue}>{formatDuration(film.movieLength)}</span>
              </div>
            )}
            
            {film.premiereCountry && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Страна:</span>
                <span className={styles.metaValue}>{film.premiereCountry}</span>
              </div>
            )}
            
            {film.originalFilmLanguage && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Язык:</span>
                <span className={styles.metaValue}>{film.originalFilmLanguage}</span>
              </div>
            )}
            
            {film.premiereWorldDate && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Премьера:</span>
                <span className={styles.metaValue}>{formatDate(film.premiereWorldDate)}</span>
              </div>
            )}
          </div>

          <div className={styles.ratings}>
            {film.ratingKp && (
              <div className={styles.rating}>
                <span className={styles.ratingLabel}>Кинопоиск:</span>
                <span className={styles.ratingValue}>{formatRating(film.ratingKp)}</span>
                {film.votesKp && (
                  <span className={styles.ratingVotes}>({film.votesKp})</span>
                )}
              </div>
            )}
            
            {film.ratingImdb && (
              <div className={styles.rating}>
                <span className={styles.ratingLabel}>IMDb:</span>
                <span className={styles.ratingValue}>{formatRating(film.ratingImdb)}</span>
                {film.votesImdb && (
                  <span className={styles.ratingVotes}>({film.votesImdb})</span>
                )}
              </div>
            )}
          </div>

          {film.description && (
            <div className={styles.description}>
              <h3 className={styles.descriptionTitle}>Описание</h3>
              <p className={styles.descriptionText}>{film.description}</p>
            </div>
          )}

          {film.trailerUrl && (
            <div className={styles.trailer}>
              <h3 className={styles.trailerTitle}>Трейлер</h3>
              <div className={styles.trailerContainer}>
                <iframe
                  src={film.trailerUrl}
                  title={`Трейлер ${film.filmNameRu}`}
                  className={styles.trailerIframe}
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    );
};