import type {
  TAdminFilmItemResponse,
  TAdminFilmsListResponse,
  TAdminListRequest,
  TCreateFilmRequest,
  TUpdateFilmRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { throwHttpFromRpcError } from "../../shared";
import { AdminKinoDbClient } from "../clients";

/** Admin CRUD фильмов: делегирует в kino-db, RPC-ошибки → HttpException. */
@Injectable()
export class AdminFilmsService {
  constructor(private readonly client: AdminKinoDbClient) {}

  async listFilms(request: TAdminListRequest): Promise<TAdminFilmsListResponse> {
    try {
      return await this.client.listFilms(request);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async getFilmById(id: number): Promise<TAdminFilmItemResponse> {
    try {
      return await this.client.getFilmById(id);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async createFilm(dto: TCreateFilmRequest): Promise<TAdminFilmItemResponse> {
    try {
      return await this.client.createFilm(dto);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async updateFilm(
    id: number,
    data: TUpdateFilmRequest
  ): Promise<TAdminFilmItemResponse> {
    try {
      return await this.client.updateFilm(id, data);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async deleteFilm(id: number): Promise<true> {
    try {
      return await this.client.deleteFilm(id);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }
}
