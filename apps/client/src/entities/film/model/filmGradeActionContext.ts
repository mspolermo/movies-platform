'use client';

import { createContext, useContext } from 'react';

export type TFilmGradeAction = (filmId: number) => void;

/**
 * Extension point: фича оценки прокидывает open-хендлер через Provider.
 * Без Provider клик по оценке — noop.
 */
export const FilmGradeActionContext = createContext<TFilmGradeAction | null>(null);

export const useFilmGradeAction = (): TFilmGradeAction | null => {
  return useContext(FilmGradeActionContext);
};
