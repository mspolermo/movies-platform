import type { TFilmListItemResponse } from '@common/types';

import type { ReactNode } from 'react';

/** Данные фильма для share-модалки (meta + URL). */
export type TShareFilmPayload = {
  id: number;
  title: string;
  year?: number | null;
  movieLength?: number | null;
  posterUrl?: string | null;
};

/** Open-хендлеры rate/share; без Provider — noop. */
export type TFilmActions = {
  openGradeFilm: (filmId: number) => void;
  openShareFilm: (payload: TShareFilmPayload) => void;
};

/**
 * Рендер overlay-кнопок на карточке.
 * Задаёт openFilmActions Provider — списки/карусели не импортят feature.
 */
export type TFilmCardActionsRenderer = (film: TFilmListItemResponse) => ReactNode;

/** Состояние избранного пользователя по фильмам. */
export type TFilmFavoriteApi = {
  isFavorite: (filmId: number) => boolean;
  /** In-flight toggle по filmId — кнопка disabled. */
  isPending: (filmId: number) => boolean;
  toggleFavorite: (filmId: number) => Promise<void>;
  isReady: boolean;
  /** Последняя ошибка toggle/hydrate; null если ок. */
  error: string | null;
};

/** Оценки текущего пользователя по фильмам. */
export type TFilmMyRatingApi = {
  getGrade: (filmId: number) => number | null;
  setGrade: (filmId: number, grade: number) => void;
  clearGrade: (filmId: number) => void;
  isReady: boolean;
  /** Ошибка hydrate grades; null если ок. Клик rate → retry. */
  error: string | null;
};
