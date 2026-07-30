import type {
  TAdminFilmItemResponse,
  TAdminFilmsListResponse,
  TAdminListRequest,
  TCreateFilmRequest,
  TUpdateFilmRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { fromRpc } from "../../shared";
import { AdminKinoDbClient } from "../clients";

/** Admin CRUD фильмов (kino-db RPC). */
@Injectable()
export class AdminFilmsService {
  constructor(private readonly client: AdminKinoDbClient) {}

  listFilms(request: TAdminListRequest): Promise<TAdminFilmsListResponse> {
    return fromRpc(this.client.listFilms(request));
  }

  getFilmById(id: number): Promise<TAdminFilmItemResponse> {
    return fromRpc(this.client.getFilmById(id));
  }

  createFilm(dto: TCreateFilmRequest): Promise<TAdminFilmItemResponse> {
    return fromRpc(this.client.createFilm(dto));
  }

  updateFilm(
    id: number,
    data: TUpdateFilmRequest
  ): Promise<TAdminFilmItemResponse> {
    return fromRpc(this.client.updateFilm(id, data));
  }

  deleteFilm(id: number): Promise<true> {
    return fromRpc(this.client.deleteFilm(id));
  }
}
