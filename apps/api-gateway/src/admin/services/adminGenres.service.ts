import type {
  TAdminGenresListResponse,
  TAdminListRequest,
  TCreateGenreRequest,
  TAdminGenreItemResponse,
  TUpdateGenreRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { fromRpc } from "../../shared";
import { AdminKinoDbClient } from "../clients";

/** Admin CRUD жанров (kino-db RPC). */
@Injectable()
export class AdminGenresService {
  constructor(private readonly client: AdminKinoDbClient) {}

  listGenres(request: TAdminListRequest): Promise<TAdminGenresListResponse> {
    return fromRpc(this.client.listGenres(request));
  }

  createGenre(dto: TCreateGenreRequest): Promise<TAdminGenreItemResponse> {
    return fromRpc(this.client.createGenre(dto));
  }

  updateGenre(
    id: number,
    data: TUpdateGenreRequest
  ): Promise<TAdminGenreItemResponse> {
    return fromRpc(this.client.updateGenre(id, data));
  }

  deleteGenre(id: number): Promise<true> {
    return fromRpc(this.client.deleteGenre(id));
  }
}
