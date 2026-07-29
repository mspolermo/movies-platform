import type {
  TAdminGenresListResponse,
  TAdminListRequest,
  TAdminUpdateGenreRpcRequest,
  TCreateGenreRequest,
  TGenreAdminItemResponse,
} from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";

import { GenresAdminService } from "../services";

/** RPC-хендлеры admin CRUD жанров; авторизация — на gateway (ADR-005). */
@Controller("admin-genres")
export class GenresAdminController {
  constructor(private readonly genresAdminService: GenresAdminService) {}

  @MessagePattern(kinoDbRpc.admin.genres.list)
  listGenres(
    @Payload() request: TAdminListRequest
  ): Promise<TAdminGenresListResponse> {
    return this.genresAdminService.listGenres(request);
  }

  @MessagePattern(kinoDbRpc.admin.genres.create)
  createGenre(
    @Payload() dto: TCreateGenreRequest
  ): Promise<TGenreAdminItemResponse> {
    return this.genresAdminService.createGenre(dto);
  }

  @MessagePattern(kinoDbRpc.admin.genres.update)
  updateGenre(
    @Payload() request: TAdminUpdateGenreRpcRequest
  ): Promise<TGenreAdminItemResponse> {
    return this.genresAdminService.updateGenre(request.id, request.data);
  }

  @MessagePattern(kinoDbRpc.admin.genres.delete)
  deleteGenre(@Payload() id: number): Promise<true> {
    return this.genresAdminService.deleteGenre(id);
  }
}
