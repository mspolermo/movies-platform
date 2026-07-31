'use client';

import type { TFilmFavoriteProviderProps } from './types';
import type { TFilmFavoriteApi } from '@/entities/film';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FilmFavoriteContext, getMyFavoriteIds, toggleFilmFavorite } from '@/entities/film';
import { buildLoginHref, useAuth } from '@/entities/user';

/**
 * Hydrate избранного (GET /favorites/ids) и optimistic toggle.
 * In-flight на filmId не ставит второй toggle в очередь (double-click = no-op).
 */
export const FilmFavoriteProvider = ({ children }: TFilmFavoriteProviderProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(() => new Set());
  const [pendingFilmIds, setPendingFilmIds] = useState<Set<number>>(() => new Set());
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingToggleFilmId, setPendingToggleFilmId] = useState<number | null>(null);
  const hydrateGenerationRef = useRef(0);
  const favoriteIdsRef = useRef(favoriteIds);
  const toggleChainsRef = useRef(new Map<number, Promise<void>>());
  const hydrateInFlightRef = useRef<Promise<boolean> | null>(null);

  favoriteIdsRef.current = favoriteIds;

  const runHydrate = useCallback(async (generation: number): Promise<boolean> => {
    try {
      const response = await getMyFavoriteIds();

      if (hydrateGenerationRef.current !== generation) {
        return false;
      }

      setFavoriteIds(new Set(response.filmIds));
      setError(null);
      setIsReady(true);
      return true;
    } catch {
      if (hydrateGenerationRef.current !== generation) {
        return false;
      }

      // Не чистим Set — иначе после retry toggle инвертирует серверное состояние.
      setPendingToggleFilmId(null);
      setError('Не удалось загрузить избранное');
      setIsReady(false);
      return false;
    }
  }, []);

  const startHydrate = useCallback(
    (generation: number): Promise<boolean> => {
      const request = runHydrate(generation).finally(() => {
        if (hydrateInFlightRef.current === request) {
          hydrateInFlightRef.current = null;
        }
      });
      hydrateInFlightRef.current = request;
      return request;
    },
    [runHydrate]
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const generation = ++hydrateGenerationRef.current;

    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      setPendingFilmIds(new Set());
      setError(null);
      setPendingToggleFilmId(null);
      setIsReady(true);
      hydrateInFlightRef.current = null;
      return;
    }

    setIsReady(false);
    setError(null);
    void startHydrate(generation);
  }, [isAuthenticated, isLoading, startHydrate]);

  const isFavorite = useCallback((filmId: number) => favoriteIds.has(filmId), [favoriteIds]);

  const isPending = useCallback((filmId: number) => pendingFilmIds.has(filmId), [pendingFilmIds]);

  const runToggle = useCallback(async (filmId: number) => {
    const generation = hydrateGenerationRef.current;
    const wasFavorite = favoriteIdsRef.current.has(filmId);

    setError(null);
    setPendingFilmIds((prev) => {
      const next = new Set(prev);
      next.add(filmId);
      return next;
    });
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFavorite) {
        next.delete(filmId);
      } else {
        next.add(filmId);
      }
      favoriteIdsRef.current = next;
      return next;
    });

    try {
      const result = await toggleFilmFavorite(filmId);

      if (hydrateGenerationRef.current !== generation) {
        return;
      }

      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (result.isFavorite) {
          next.add(filmId);
        } else {
          next.delete(filmId);
        }
        favoriteIdsRef.current = next;
        return next;
      });
    } catch {
      if (hydrateGenerationRef.current !== generation) {
        return;
      }

      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) {
          next.add(filmId);
        } else {
          next.delete(filmId);
        }
        favoriteIdsRef.current = next;
        return next;
      });
      setError('Не удалось изменить избранное');
    } finally {
      setPendingFilmIds((prev) => {
        if (!prev.has(filmId)) {
          return prev;
        }
        const next = new Set(prev);
        next.delete(filmId);
        return next;
      });
    }
  }, []);

  const enqueueToggle = useCallback(
    async (filmId: number) => {
      const existing = toggleChainsRef.current.get(filmId);
      // Уже in-flight — не ставим второй toggle (double-click / spam).
      if (existing) {
        await existing;
        return;
      }

      const next = runToggle(filmId).finally(() => {
        if (toggleChainsRef.current.get(filmId) === next) {
          toggleChainsRef.current.delete(filmId);
        }
      });
      toggleChainsRef.current.set(filmId, next);
      await next;
    },
    [runToggle]
  );

  const retryHydrate = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || isLoading) {
      return false;
    }

    if (hydrateInFlightRef.current) {
      return hydrateInFlightRef.current;
    }

    const generation = ++hydrateGenerationRef.current;
    setIsReady(false);
    setError(null);
    return startHydrate(generation);
  }, [isAuthenticated, isLoading, startHydrate]);

  const toggleFavorite = useCallback(
    async (filmId: number) => {
      if (isLoading) {
        setPendingToggleFilmId(filmId);
        return;
      }

      if (!isAuthenticated) {
        setPendingToggleFilmId(null);
        router.push(buildLoginHref());
        return;
      }

      if (!isReady) {
        if (error) {
          // UI при !isReady всегда «не в избранном» → intent = add.
          // После retry не тоглим, если сервер уже держит filmId (иначе silent remove).
          const ok = await retryHydrate();
          if (ok && !favoriteIdsRef.current.has(filmId)) {
            await enqueueToggle(filmId);
          }
          return;
        }
        setPendingToggleFilmId(filmId);
        return;
      }

      setPendingToggleFilmId(null);
      await enqueueToggle(filmId);
    },
    [enqueueToggle, error, isAuthenticated, isLoading, isReady, retryHydrate, router]
  );

  useEffect(() => {
    if (isLoading || pendingToggleFilmId === null) {
      return;
    }

    if (!isAuthenticated) {
      setPendingToggleFilmId(null);
      router.push(buildLoginHref());
      return;
    }

    if (!isReady) {
      return;
    }

    const id = pendingToggleFilmId;
    setPendingToggleFilmId(null);
    void enqueueToggle(id);
  }, [enqueueToggle, isAuthenticated, isLoading, isReady, pendingToggleFilmId, router]);

  const value = useMemo<TFilmFavoriteApi>(
    () => ({
      isFavorite,
      isPending,
      toggleFavorite,
      isReady,
      error,
    }),
    [error, isFavorite, isPending, isReady, toggleFavorite]
  );

  return <FilmFavoriteContext.Provider value={value}>{children}</FilmFavoriteContext.Provider>;
};
