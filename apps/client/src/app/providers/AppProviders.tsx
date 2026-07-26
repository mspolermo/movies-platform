'use client';

import type { PropsWithChildren } from 'react';

import { AuthProvider } from '@/features/auth';
import { FilmActionsProvider } from '@/features/openFilmActions';

/**
 * Composition root: глобальные клиентские провайдеры (auth → film actions).
 */
export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <FilmActionsProvider>{children}</FilmActionsProvider>
    </AuthProvider>
  );
};
