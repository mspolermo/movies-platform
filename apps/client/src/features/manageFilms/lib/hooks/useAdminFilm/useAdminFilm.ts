'use client';

import type { TAdminFilmItemResponse } from '@common/types';

import { useEffect, useState } from 'react';

import { getFilmByIdStub } from '../../../api';

/** Состояние загрузки одного фильма для формы редактирования. */
export type TAdminFilmLoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; film: TAdminFilmItemResponse }
  | { status: 'missing' }
  | { status: 'error'; message: string };

/**
 * Загрузка фильма по id (заглушка); в режиме create — статус idle.
 * `reloadToken` — увеличить для повтора после ошибки.
 */
export const useAdminFilm = (
  mode: 'create' | 'edit',
  filmId?: number,
  reloadToken = 0
): TAdminFilmLoadState => {
  const [state, setState] = useState<TAdminFilmLoadState>(() =>
    mode === 'create' ? { status: 'idle' } : { status: 'loading' }
  );

  useEffect(() => {
    if (mode !== 'edit') {
      setState({ status: 'idle' });
      return;
    }

    if (filmId == null || Number.isNaN(filmId)) {
      setState({ status: 'missing' });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    getFilmByIdStub(filmId)
      .then((result) => {
        if (cancelled) return;
        setState(result ? { status: 'ready', film: result } : { status: 'missing' });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ status: 'error', message: 'Не удалось загрузить фильм' });
      });

    return () => {
      cancelled = true;
    };
  }, [mode, filmId, reloadToken]);

  return state;
};
