import type {
  TToggleFavoriteResponse,
  TMyFavoritesResponse,
  TMyFavoriteIdsResponse,
  TListPaginationParams,
} from "@common/types";

import { Injectable, NotFoundException } from "@nestjs/common";

import { FilmsService } from "../../films/services";
import { fromRpc } from "../../shared";
import { FavoritesClient } from "../clients";

/** HTTP-оркестрация избранного: validate film → auth-users. */
@Injectable()
export class FavoritesService {
  constructor(
    private readonly favoritesClient: FavoritesClient,
    private readonly filmsService: FilmsService
  ) {}

  /**
   * Toggle избранного.
   * Фильм есть → полный toggle; фильма нет (404) → только remove (orphan cleanup).
   */
  async toggle(
    userId: number,
    filmId: number
  ): Promise<TToggleFavoriteResponse> {
    try {
      await this.filmsService.getFilmById(filmId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return fromRpc(this.favoritesClient.remove(userId, filmId));
      }
      throw error;
    }

    return fromRpc(this.favoritesClient.toggle(userId, filmId));
  }

  list(
    userId: number,
    params: TListPaginationParams
  ): Promise<TMyFavoritesResponse> {
    return fromRpc(this.favoritesClient.list(userId, params));
  }

  ids(userId: number): Promise<TMyFavoriteIdsResponse> {
    return fromRpc(this.favoritesClient.ids(userId));
  }
}
