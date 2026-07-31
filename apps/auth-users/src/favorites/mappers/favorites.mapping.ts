import type { UserFavorite } from "../models";
import type {
  TUserFavoriteItemResponse,
  TMyFavoriteIdsResponse,
} from "@common/types";

/** ORM → элемент списка избранного. */
export function mapFavoriteToItemResponse(
  favorite: UserFavorite
): TUserFavoriteItemResponse {
  return {
    filmId: favorite.filmId,
    createdAt: favorite.createdAt.toISOString(),
  };
}

/** Список filmId для compact hydrate. */
export function mapFavoritesToIdsResponse(
  favorites: UserFavorite[]
): TMyFavoriteIdsResponse {
  return {
    filmIds: favorites.map((favorite) => favorite.filmId),
  };
}
