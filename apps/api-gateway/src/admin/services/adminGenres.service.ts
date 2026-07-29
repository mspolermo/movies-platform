import type {
  TAdminGenresListResponse,
  TAdminListRequest,
  TCreateGenreRequest,
  TGenreAdminItemResponse,
  TUpdateGenreRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { throwHttpFromRpcError } from "../../shared";
import { AdminKinoDbClient } from "../clients";

/** Admin CRUD жанров: делегирует в kino-db, RPC-ошибки → HttpException. */
@Injectable()
export class AdminGenresService {
  constructor(private readonly client: AdminKinoDbClient) {}

  async listGenres(
    request: TAdminListRequest
  ): Promise<TAdminGenresListResponse> {
    try {
      return await this.client.listGenres(request);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async createGenre(dto: TCreateGenreRequest): Promise<TGenreAdminItemResponse> {
    try {
      return await this.client.createGenre(dto);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async updateGenre(
    id: number,
    data: TUpdateGenreRequest
  ): Promise<TGenreAdminItemResponse> {
    try {
      return await this.client.updateGenre(id, data);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async deleteGenre(id: number): Promise<true> {
    try {
      return await this.client.deleteGenre(id);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }
}
