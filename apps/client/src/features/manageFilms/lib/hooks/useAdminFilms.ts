'use client';

import { useSyncExternalStore } from 'react';

import { getFilmsSnapshot, subscribeFilms } from '../../api';

/** React-подписка на список фильмов (заглушка). */
export const useAdminFilms = () =>
  useSyncExternalStore(subscribeFilms, getFilmsSnapshot, getFilmsSnapshot);
