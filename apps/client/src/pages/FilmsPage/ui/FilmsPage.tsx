'use client';

import { Layout } from '@/widgets/Layout';
import { FilmCard, FilmCardSkeleton } from '@/entities/film';
import { FilmsInfiniteScroll } from '@/features/films/infinite-scroll';
import styles from './FilmsPage.module.scss';

export const FilmsPage = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Фильмы</h1>
        
        <FilmsInfiniteScroll
          initialParams={{}}
          threshold={200}
          className={styles.filmsContainer}
        >
          {(films, loading, error) => {
            if (error) {
              return (
                <div className={styles.error}>{error}</div>
              );
            }

            return (
              <div className={styles.filmsGrid}>
                {loading && films.length === 0 ? (
                  // Показываем скелетоны только при первой загрузке
                  Array.from({ length: 8 }).map((_, index) => (
                    <FilmCardSkeleton 
                      key={`skeleton-${index}`} 
                      showIcons={true}
                    />
                  ))
                ) : films && films.length > 0 ? (
                  films.map((film) => (
                    <FilmCard 
                      key={film.id} 
                      film={film} 
                      showIcons={true}
                    />
                  ))
                ) : (
                  <div className={styles.noFilms}>
                    Фильмы не найдены
                  </div>
                )}
              </div>
            );
          }}
        </FilmsInfiniteScroll>
      </div>
    </Layout>
  );
}

