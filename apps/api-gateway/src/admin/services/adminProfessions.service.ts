import type {
  TAdminListRequest,
  TAdminProfessionsListResponse,
  TCreateProfessionRequest,
  TProfessionAdminItemResponse,
  TUpdateProfessionRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { throwHttpFromRpcError } from "../../shared";
import { AdminKinoDbClient } from "../clients";

/** Admin CRUD профессий: делегирует в kino-db, RPC-ошибки → HttpException. */
@Injectable()
export class AdminProfessionsService {
  constructor(private readonly client: AdminKinoDbClient) {}

  async listProfessions(
    request: TAdminListRequest
  ): Promise<TAdminProfessionsListResponse> {
    try {
      return await this.client.listProfessions(request);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async createProfession(
    dto: TCreateProfessionRequest
  ): Promise<TProfessionAdminItemResponse> {
    try {
      return await this.client.createProfession(dto);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async updateProfession(
    id: number,
    data: TUpdateProfessionRequest
  ): Promise<TProfessionAdminItemResponse> {
    try {
      return await this.client.updateProfession(id, data);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async deleteProfession(id: number): Promise<true> {
    try {
      return await this.client.deleteProfession(id);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }
}
