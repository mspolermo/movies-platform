import type { TFilmDetailsResponse, TFilmListItemResponse } from '@common/types';

import { searchFilms } from './searchFilms';

const SIMILAR_FILMS_LIMIT = 20;

/**
 * Похожие фильмы по жанрам текущего фильма (исключая сам фильм).
 */
export const getSimilarFilms = async (
  film: Pick<TFilmDetailsResponse, 'id' | 'genres'>
): Promise<TFilmListItemResponse[]> => {
  const genreNames =
    film.genres?.map((genre) => genre.nameRu).filter((name): name is string => Boolean(name)) ?? [];

  if (genreNames.length === 0) {
    return [];
  }

  const response = await searchFilms({
    genres: genreNames,
    perPage: SIMILAR_FILMS_LIMIT + 1,
    sortBy: 'rating',
  });

  return response.films.filter((item) => item.id !== film.id).slice(0, SIMILAR_FILMS_LIMIT);
};
