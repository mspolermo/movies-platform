import type { TShareFilmPayload, TFilmActions, TFilmMyRatingApi } from '@/entities/film';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { deleteFilmRating, getMyFilmRatingGrades } from '@/entities/film';
import { buildLoginHref, useAuth } from '@/entities/user';

import { submitFilmGrade } from '../utils';

type TRateFilmStep = 'rate' | 'success';

type TUseFilmActionsModalsResult = {
  filmActions: TFilmActions;
  filmMyRating: TFilmMyRatingApi;
  isGradeOpen: boolean;
  isShareOpen: boolean;
  gradeStep: TRateFilmStep;
  gradeTitle: string;
  selectedGrade: number | null;
  gradeError: string | null;
  isGradeSubmitting: boolean;
  sharePayload: TShareFilmPayload | null;
  handleCloseGrade: () => void;
  handleCloseShare: () => void;
  handleSelectGrade: (grade: number) => void;
  handleDeleteGrade: () => void;
};

/**
 * Стейт модалок grade/share, hydrate оценок, auth-gate.
 * Модалка оценки не открывается до конца hydrate — иначе late GET затирает Map.
 */
export const useFilmActionsModals = (): TUseFilmActionsModalsResult => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [gradeFilmId, setGradeFilmId] = useState<number | null>(null);
  const [pendingGradeFilmId, setPendingGradeFilmId] = useState<number | null>(null);
  const [gradeStep, setGradeStep] = useState<TRateFilmStep>('rate');
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [isGradeSubmitting, setIsGradeSubmitting] = useState(false);
  const [sharePayload, setSharePayload] = useState<TShareFilmPayload | null>(null);
  const [gradesByFilmId, setGradesByFilmId] = useState<Map<number, number>>(() => new Map());
  const [isRatingsReady, setIsRatingsReady] = useState(false);
  const [ratingsHydrateError, setRatingsHydrateError] = useState<string | null>(null);
  const hydrateGenerationRef = useRef(0);
  const hydrateInFlightRef = useRef<Promise<boolean> | null>(null);

  const isGradeOpen = gradeFilmId !== null;
  const isShareOpen = sharePayload !== null;
  const selectedGrade = gradeFilmId !== null ? (gradesByFilmId.get(gradeFilmId) ?? null) : null;
  const gradeTitle = gradeStep === 'success' ? 'Ваша оценка принята' : 'Ваша оценка';

  const runHydrate = useCallback(async (generation: number): Promise<boolean> => {
    try {
      const response = await getMyFilmRatingGrades();

      if (hydrateGenerationRef.current !== generation) {
        return false;
      }

      const next = new Map<number, number>();
      for (const item of response.items) {
        next.set(item.filmId, item.grade);
      }
      setGradesByFilmId(next);
      setRatingsHydrateError(null);
      setIsRatingsReady(true);
      return true;
    } catch {
      if (hydrateGenerationRef.current !== generation) {
        return false;
      }

      // Не чистим Map — иначе после retry UI врёт «нет оценки».
      setPendingGradeFilmId(null);
      setRatingsHydrateError('Не удалось загрузить оценки');
      setIsRatingsReady(false);
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
      setGradesByFilmId(new Map());
      setRatingsHydrateError(null);
      setIsRatingsReady(true);
      hydrateInFlightRef.current = null;
      // In-flight grade submit/delete смотрит на generation — иначе finally
      // early-return оставит isGradeSubmitting=true и залочит шкалу.
      setIsGradeSubmitting(false);
      setGradeError(null);
      setGradeStep('rate');
      setGradeFilmId(null);
      setPendingGradeFilmId(null);
      return;
    }

    setIsRatingsReady(false);
    setRatingsHydrateError(null);
    void startHydrate(generation);
  }, [isAuthenticated, isLoading, startHydrate]);

  const retryHydrate = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || isLoading) {
      return false;
    }

    if (hydrateInFlightRef.current) {
      return hydrateInFlightRef.current;
    }

    const generation = ++hydrateGenerationRef.current;
    setIsRatingsReady(false);
    setRatingsHydrateError(null);
    return startHydrate(generation);
  }, [isAuthenticated, isLoading, startHydrate]);

  const getGrade = useCallback(
    (filmId: number) => gradesByFilmId.get(filmId) ?? null,
    [gradesByFilmId]
  );

  const setGrade = useCallback((filmId: number, grade: number) => {
    setGradesByFilmId((prev) => {
      const next = new Map(prev);
      next.set(filmId, grade);
      return next;
    });
  }, []);

  const clearGrade = useCallback((filmId: number) => {
    setGradesByFilmId((prev) => {
      const next = new Map(prev);
      next.delete(filmId);
      return next;
    });
  }, []);

  const filmMyRating = useMemo<TFilmMyRatingApi>(
    () => ({
      getGrade,
      setGrade,
      clearGrade,
      isReady: isRatingsReady,
      error: ratingsHydrateError,
    }),
    [clearGrade, getGrade, isRatingsReady, ratingsHydrateError, setGrade]
  );

  const handleCloseGrade = useCallback(() => {
    setGradeFilmId(null);
    setGradeStep('rate');
    setGradeError(null);
    setIsGradeSubmitting(false);
  }, []);

  const handleCloseShare = useCallback(() => {
    setSharePayload(null);
  }, []);

  const openGradeForAuthenticated = useCallback((id: number) => {
    setSharePayload(null);
    setGradeStep('rate');
    setGradeError(null);
    setIsGradeSubmitting(false);
    setGradeFilmId(id);
  }, []);

  const openGradeFilm = useCallback(
    (id: number) => {
      if (isLoading) {
        setPendingGradeFilmId(id);
        return;
      }

      if (!isAuthenticated) {
        setPendingGradeFilmId(null);
        router.push(buildLoginHref());
        return;
      }

      // Ждём hydrate — иначе late GET перезапишет Map после upsert.
      // Hydrate fail: клик = retry + открыть после успеха.
      if (!isRatingsReady) {
        if (ratingsHydrateError) {
          void retryHydrate().then((ok) => {
            if (ok) {
              openGradeForAuthenticated(id);
            }
          });
          return;
        }
        setPendingGradeFilmId(id);
        return;
      }

      setPendingGradeFilmId(null);
      openGradeForAuthenticated(id);
    },
    [
      isAuthenticated,
      isLoading,
      isRatingsReady,
      openGradeForAuthenticated,
      ratingsHydrateError,
      retryHydrate,
      router,
    ]
  );

  useEffect(() => {
    if (isLoading || pendingGradeFilmId === null) {
      return;
    }

    if (!isAuthenticated) {
      setPendingGradeFilmId(null);
      router.push(buildLoginHref());
      return;
    }

    if (!isRatingsReady) {
      return;
    }

    const id = pendingGradeFilmId;
    setPendingGradeFilmId(null);
    openGradeForAuthenticated(id);
  }, [
    isAuthenticated,
    isLoading,
    isRatingsReady,
    openGradeForAuthenticated,
    pendingGradeFilmId,
    router,
  ]);

  const openShareFilm = useCallback((payload: TShareFilmPayload) => {
    setGradeFilmId(null);
    setPendingGradeFilmId(null);
    setGradeStep('rate');
    setGradeError(null);
    setSharePayload(payload);
  }, []);

  const handleSelectGrade = useCallback(
    (grade: number) => {
      if (gradeFilmId === null || isGradeSubmitting || !isRatingsReady) {
        return;
      }

      const filmId = gradeFilmId;
      const generation = hydrateGenerationRef.current;

      setIsGradeSubmitting(true);
      setGradeError(null);

      void submitFilmGrade({ filmId, grade })
        .then(() => {
          if (hydrateGenerationRef.current !== generation) {
            return;
          }

          setGrade(filmId, grade);
          setGradeStep('success');
        })
        .catch((err: unknown) => {
          if (hydrateGenerationRef.current !== generation) {
            return;
          }

          // Gateway: film 404 → orphan delete + 404; Map иначе держит мёртвую оценку.
          if (isAxiosError(err) && err.response?.status === 404) {
            clearGrade(filmId);
            setGradeError('Фильм недоступен, оценка удалена');
            return;
          }

          setGradeError('Не удалось сохранить оценку');
        })
        .finally(() => {
          // Всегда снимаем lock — generation мог смениться на logout/login.
          setIsGradeSubmitting(false);
        });
    },
    [clearGrade, gradeFilmId, isGradeSubmitting, isRatingsReady, setGrade]
  );

  const handleDeleteGrade = useCallback(() => {
    if (gradeFilmId === null || isGradeSubmitting || !isRatingsReady) {
      return;
    }

    const filmId = gradeFilmId;
    const generation = hydrateGenerationRef.current;

    setIsGradeSubmitting(true);
    setGradeError(null);

    void deleteFilmRating(filmId)
      .then(() => {
        if (hydrateGenerationRef.current !== generation) {
          return;
        }

        clearGrade(filmId);
        handleCloseGrade();
      })
      .catch(() => {
        if (hydrateGenerationRef.current !== generation) {
          return;
        }

        setGradeError('Не удалось удалить оценку');
      })
      .finally(() => {
        // Всегда снимаем lock — generation мог смениться на logout/login.
        setIsGradeSubmitting(false);
      });
  }, [clearGrade, gradeFilmId, handleCloseGrade, isGradeSubmitting, isRatingsReady]);

  const filmActions = useMemo<TFilmActions>(
    () => ({
      openGradeFilm,
      openShareFilm,
    }),
    [openGradeFilm, openShareFilm]
  );

  return {
    filmActions,
    filmMyRating,
    isGradeOpen,
    isShareOpen,
    gradeStep,
    gradeTitle,
    selectedGrade,
    gradeError,
    isGradeSubmitting,
    sharePayload,
    handleCloseGrade,
    handleCloseShare,
    handleSelectGrade,
    handleDeleteGrade,
  };
};
