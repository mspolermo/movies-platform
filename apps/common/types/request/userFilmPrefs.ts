import { TListRequest } from "../shared";

/** Query GET /favorites. */
export type TGetMyFavoritesParams = TListRequest;

/** Query GET /ratings. */
export type TGetMyFilmRatingsParams = TListRequest;

/** Body PUT /ratings/:filmId. */
export type TUpsertFilmRatingRequest = {
  grade: number;
};

/** RPC favorites.toggle. */
export type TToggleFavoriteRpcRequest = {
  userId: number;
  filmId: number;
};

/** RPC favorites.remove (idempotent; для orphan при 404 фильма). */
export type TRemoveFavoriteRpcRequest = {
  userId: number;
  filmId: number;
};

/** RPC favorites.list. */
export type TListFavoritesRpcRequest = {
  userId: number;
} & TListRequest;

/** RPC favorites.ids. */
export type TFavoriteIdsRpcRequest = {
  userId: number;
};

/** RPC ratings.upsert. */
export type TUpsertFilmRatingRpcRequest = {
  userId: number;
  filmId: number;
  grade: number;
};

/** RPC ratings.delete. */
export type TDeleteFilmRatingRpcRequest = {
  userId: number;
  filmId: number;
};

/** RPC ratings.list. */
export type TListFilmRatingsRpcRequest = {
  userId: number;
} & TListRequest;

/** RPC ratings.grades. */
export type TFilmRatingGradesRpcRequest = {
  userId: number;
};
