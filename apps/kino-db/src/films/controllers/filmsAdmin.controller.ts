import type {
  TAdminFilmItemResponse,
  TAdminFilmsListResponse,
  TAdminListRequest,
  TAdminUpdateFilmRpcRequest,
  TCreateFilmRequest,
} from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";

import { FilmsAdminService } from "../services";

@Controller("admin-films")
export class FilmsAdminController {
  constructor(private readonly filmsAdminService: FilmsAdminService) {}

  @MessagePattern(kinoDbRpc.admin.films.list)
  listFilms(
    @Payload() request: TAdminListRequest
  ): Promise<TAdminFilmsListResponse> {
    return this.filmsAdminService.listFilms(request);
  }

  @MessagePattern(kinoDbRpc.admin.films.getById)
  getFilmById(@Payload() id: number): Promise<TAdminFilmItemResponse> {
    return this.filmsAdminService.getFilmById(id);
  }

  @MessagePattern(kinoDbRpc.admin.films.create)
  createFilm(
    @Payload() dto: TCreateFilmRequest
  ): Promise<TAdminFilmItemResponse> {
    return this.filmsAdminService.createFilm(dto);
  }

  @MessagePattern(kinoDbRpc.admin.films.update)
  updateFilm(
    @Payload() request: TAdminUpdateFilmRpcRequest
  ): Promise<TAdminFilmItemResponse> {
    return this.filmsAdminService.updateFilm(request.id, request.data);
  }

  @MessagePattern(kinoDbRpc.admin.films.delete)
  deleteFilm(@Payload() id: number): Promise<true> {
    return this.filmsAdminService.deleteFilm(id);
  }
}
