'use client';

import type { TFilmCardActionsRenderer } from '../types';

import { createContext, useContext } from 'react';

/**
 * Рендер overlay-кнопок на карточке. Задаёт openFilmActions Provider —
 * списки/карусели не импортят feature.
 */
export const FilmCardActionsContext = createContext<TFilmCardActionsRenderer | null>(null);

export const useFilmCardActions = (): TFilmCardActionsRenderer | null => {
  return useContext(FilmCardActionsContext);
};
