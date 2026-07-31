import type { TUserFavoriteEntity, TUserFilmRatingEntity } from "../entity";
import type { TPaginatedItemsResponse } from "../shared";

/** Элемент пагинированного избранного. */
export type TUserFavoriteItemResponse = Pick<TUserFavoriteEntity, "filmId"> & {
  createdAt: string;
};

/** Элемент пагинированных оценок. */
export type TUserFilmRatingItemResponse = Pick<
  TUserFilmRatingEntity,
  "filmId" | "grade"
> & {
  updatedAt: string;
};

/** GET /favorites. */
export type TMyFavoritesResponse =
  TPaginatedItemsResponse<TUserFavoriteItemResponse>;

/** GET /ratings. */
export type TMyFilmRatingsResponse =
  TPaginatedItemsResponse<TUserFilmRatingItemResponse>;

/** Ответ toggle избранного. */
export type TToggleFavoriteResponse = {
  isFavorite: boolean;
};

/** Ответ upsert оценки. */
export type TUpsertFilmRatingResponse = TUserFilmRatingItemResponse;

/** Удаление оценки; false если записи не было. */
export type TDeleteFilmRatingResponse = {
  deleted: boolean;
};

/** Compact hydrate избранного для панели. */
export type TMyFavoriteIdsResponse = {
  filmIds: number[];
};

/** Compact hydrate оценок для панели. */
export type TMyFilmRatingGradesResponse = {
  items: Array<Pick<TUserFilmRatingItemResponse, "filmId" | "grade">>;
};
