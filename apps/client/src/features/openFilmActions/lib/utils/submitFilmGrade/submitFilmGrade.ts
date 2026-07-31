import type { TSubmitFilmGradeParams } from '../../../model';
import type { TUpsertFilmRatingResponse } from '@common/types';

import { upsertFilmRating } from '@/entities/film';

/** Отправить или обновить оценку фильма. */
export const submitFilmGrade = async ({
  filmId,
  grade,
}: TSubmitFilmGradeParams): Promise<TUpsertFilmRatingResponse> => {
  return upsertFilmRating(filmId, { grade });
};
