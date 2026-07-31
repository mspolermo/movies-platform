import type {
  TToggleFavoriteRpcRequest,
  TRemoveFavoriteRpcRequest,
  TListFavoritesRpcRequest,
  TFavoriteIdsRpcRequest,
  TToggleFavoriteResponse,
  TMyFavoritesResponse,
  TMyFavoriteIdsResponse,
} from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { authUsersRpc } from "@common/services";

import { FavoritesService } from "../services";

@Controller()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @MessagePattern(authUsersRpc.favorites.toggle)
  toggle(
    @Payload() data: TToggleFavoriteRpcRequest
  ): Promise<TToggleFavoriteResponse> {
    return this.favoritesService.toggle(data);
  }

  @MessagePattern(authUsersRpc.favorites.remove)
  remove(
    @Payload() data: TRemoveFavoriteRpcRequest
  ): Promise<TToggleFavoriteResponse> {
    return this.favoritesService.remove(data);
  }

  @MessagePattern(authUsersRpc.favorites.list)
  list(
    @Payload() data: TListFavoritesRpcRequest
  ): Promise<TMyFavoritesResponse> {
    return this.favoritesService.list(data);
  }

  @MessagePattern(authUsersRpc.favorites.ids)
  ids(@Payload() data: TFavoriteIdsRpcRequest): Promise<TMyFavoriteIdsResponse> {
    return this.favoritesService.ids(data);
  }
}
