import type { UserFilmRating } from "../models";
import type {
  TUserFilmRatingItemResponse,
  TMyFilmRatingGradesResponse,
} from "@common/types";

/** ORM → элемент списка / upsert оценки. */
export function mapRatingToItemResponse(
  rating: UserFilmRating
): TUserFilmRatingItemResponse {
  return {
    filmId: rating.filmId,
    grade: rating.grade,
    updatedAt: rating.updatedAt.toISOString(),
  };
}

/** Compact hydrate оценок для панели. */
export function mapRatingsToGradesResponse(
  ratings: UserFilmRating[]
): TMyFilmRatingGradesResponse {
  return {
    items: ratings.map((rating) => ({
      filmId: rating.filmId,
      grade: rating.grade,
    })),
  };
}
