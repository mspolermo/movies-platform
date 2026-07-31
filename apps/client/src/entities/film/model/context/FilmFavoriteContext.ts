'use client';

import type { TFilmFavoriteApi } from '../types';

import { createContext, useContext } from 'react';

/**
 * Избранное пользователя; Provider — feature toggleFilmFavorite.
 * Без Provider — null (кнопки disabled/noop).
 */
export const FilmFavoriteContext = createContext<TFilmFavoriteApi | null>(null);

export const useFilmFavorite = (): TFilmFavoriteApi | null => {
  return useContext(FilmFavoriteContext);
};
