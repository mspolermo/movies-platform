import type {
  TToggleFavoriteResponse,
  TMyFavoritesResponse,
  TMyFavoriteIdsResponse,
  TListPaginationParams,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { authUsersRpc, RmqService } from "@common/services";

/** RMQ-клиент избранного (auth-users). */
@Injectable()
export class FavoritesClient {
  constructor(private readonly rmq: RmqService) {}

  toggle(userId: number, filmId: number): Promise<TToggleFavoriteResponse> {
    return this.rmq.sendToUsers(authUsersRpc.favorites.toggle, {
      userId,
      filmId,
    });
  }

  /** Idempotent remove — без create (orphan / film 404). */
  remove(userId: number, filmId: number): Promise<TToggleFavoriteResponse> {
    return this.rmq.sendToUsers(authUsersRpc.favorites.remove, {
      userId,
      filmId,
    });
  }

  list(
    userId: number,
    params: TListPaginationParams
  ): Promise<TMyFavoritesResponse> {
    return this.rmq.sendToUsers(authUsersRpc.favorites.list, {
      userId,
      ...params,
    });
  }

  ids(userId: number): Promise<TMyFavoriteIdsResponse> {
    return this.rmq.sendToUsers(authUsersRpc.favorites.ids, { userId });
  }
}
