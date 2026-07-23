import type { THomeGenreCarousel } from '../types';

import { unstable_cache } from 'next/cache';

import { searchFilms } from '@/entities/film';
import { getGenresList } from '@/entities/genre';
import { DEFAULT_REVALIDATE_SECONDS } from '@/shared/constants';
import { capitalizeFirst } from '@/shared/lib';

import { shuffleFisherYates } from './shuffleFisherYates';

//TODO: разобрать

const HOME_GENRE_CAROUSELS_COUNT = 10;
const HOME_FILMS_PER_GENRE = 20;

/** Seed жанров по UTC-дню — набор каруселей стабилен в пределах суток. */
const getUtcDaySeed = (): number => Math.floor(Date.now() / 86_400_000);

const fetchHomeGenreCarousels = async (): Promise<THomeGenreCarousel[]> => {
  const genres = await getGenresList();
  const selectedGenres = shuffleFisherYates(genres, getUtcDaySeed()).slice(
    0,
    HOME_GENRE_CAROUSELS_COUNT
  );

  const genreCarousels = await Promise.all(
    selectedGenres.map(async (genre): Promise<THomeGenreCarousel | null> => {
      const genreName = genre.nameRu || genre.nameEn;

      if (!genreName) {
        return null;
      }

      try {
        const response = await searchFilms({
          genres: [genreName],
          perPage: HOME_FILMS_PER_GENRE,
          sortBy: 'rating',
        });

        if (!response.items?.length) {
          return null;
        }

        return {
          genreKey: genreName,
          title: `Фильмы жанра «${capitalizeFirst(genreName)}»`,
          films: response.items,
        };
      } catch (error) {
        console.error(`Home carousel failed for genre «${genreName}»`, error);

        return null;
      }
    })
  );

  return genreCarousels.filter((carousel): carousel is THomeGenreCarousel => carousel !== null);
};

/**
 * 10 жанровых каруселей для главной.
 * Набор жанров стабилен в пределах UTC-дня; ответ кэшируется (ISR).
 */
export const getHomeGenreCarousels = async (): Promise<THomeGenreCarousel[]> => {
  const dayKey = String(getUtcDaySeed());

  return unstable_cache(fetchHomeGenreCarousels, ['home-genre-carousels', 'items-v1', dayKey], {
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  })();
};
