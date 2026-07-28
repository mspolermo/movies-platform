'use client';

import { useSyncExternalStore } from 'react';

import { getGenresSnapshot, subscribeGenres } from '../../api';

/** React-подписка на список жанров (заглушка). */
export const useAdminGenres = () =>
  useSyncExternalStore(subscribeGenres, getGenresSnapshot, getGenresSnapshot);
