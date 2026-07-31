'use client';

import type { TFilmMyRatingApi } from '../types';

import { createContext, useContext } from 'react';

/**
 * Оценки пользователя по фильмам; Provider — openFilmActions.
 * Без Provider — null.
 */
export const FilmMyRatingContext = createContext<TFilmMyRatingApi | null>(null);

export const useFilmMyRating = (): TFilmMyRatingApi | null => {
  return useContext(FilmMyRatingContext);
};
