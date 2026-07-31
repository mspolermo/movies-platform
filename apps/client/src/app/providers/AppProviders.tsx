'use client';

import type { PropsWithChildren } from 'react';

import { AuthProvider } from '@/features/auth';
import { FilmActionsProvider } from '@/features/openFilmActions';
import { FilmFavoriteProvider } from '@/features/toggleFilmFavorite';

/**
 * Composition root: auth → favorites → film actions.
 */
export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <FilmFavoriteProvider>
        <FilmActionsProvider>{children}</FilmActionsProvider>
      </FilmFavoriteProvider>
    </AuthProvider>
  );
};
