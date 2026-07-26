'use client';

import type { TFilmActions } from '../types';

import { createContext, useContext } from 'react';

/**
 * Extension point: openFilmActions прокидывает open-хендлеры через Provider.
 * Без Provider клики rate/share — noop.
 */
export const FilmActionsContext = createContext<TFilmActions | null>(null);

export const useFilmActions = (): TFilmActions | null => {
  return useContext(FilmActionsContext);
};
