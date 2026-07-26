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
