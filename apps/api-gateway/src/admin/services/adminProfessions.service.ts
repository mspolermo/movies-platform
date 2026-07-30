import type {
  TAdminListRequest,
  TAdminProfessionsListResponse,
  TCreateProfessionRequest,
  TAdminProfessionItemResponse,
  TUpdateProfessionRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { fromRpc } from "../../shared";
import { AdminKinoDbClient } from "../clients";

/** Admin CRUD профессий (kino-db RPC). */
@Injectable()
export class AdminProfessionsService {
  constructor(private readonly client: AdminKinoDbClient) {}

  listProfessions(
    request: TAdminListRequest
  ): Promise<TAdminProfessionsListResponse> {
    return fromRpc(this.client.listProfessions(request));
  }

  createProfession(
    dto: TCreateProfessionRequest
  ): Promise<TAdminProfessionItemResponse> {
    return fromRpc(this.client.createProfession(dto));
  }

  updateProfession(
    id: number,
    data: TUpdateProfessionRequest
  ): Promise<TAdminProfessionItemResponse> {
    return fromRpc(this.client.updateProfession(id, data));
  }

  deleteProfession(id: number): Promise<true> {
    return fromRpc(this.client.deleteProfession(id));
  }
}
