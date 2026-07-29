import type {
  TAdminListRequest,
  TAdminPersonsListResponse,
  TCreatePersonRequest,
  TPersonAdminItemResponse,
  TUpdatePersonRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { throwHttpFromRpcError } from "../../shared";
import { AdminKinoDbClient } from "../clients";

/** Admin CRUD персон: делегирует в kino-db, RPC-ошибки → HttpException. */
@Injectable()
export class AdminPersonsService {
  constructor(private readonly client: AdminKinoDbClient) {}

  async listPersons(
    request: TAdminListRequest
  ): Promise<TAdminPersonsListResponse> {
    try {
      return await this.client.listPersons(request);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async getPersonById(id: number): Promise<TPersonAdminItemResponse> {
    try {
      return await this.client.getPersonById(id);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async createPerson(
    dto: TCreatePersonRequest
  ): Promise<TPersonAdminItemResponse> {
    try {
      return await this.client.createPerson(dto);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async updatePerson(
    id: number,
    data: TUpdatePersonRequest
  ): Promise<TPersonAdminItemResponse> {
    try {
      return await this.client.updatePerson(id, data);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async deletePerson(id: number): Promise<true> {
    try {
      return await this.client.deletePerson(id);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }
}
