import type {
  TAdminListRequest,
  TAdminUserItemResponse,
  TAdminUsersListResponse,
  TUpdateUserRoleRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { throwHttpFromRpcError } from "../../shared";
import { AdminUsersClient } from "../clients";

/** Admin-операции над пользователями: делегирует в auth-users, RPC-ошибки → HttpException. */
@Injectable()
export class AdminUsersService {
  constructor(private readonly client: AdminUsersClient) {}

  async listUsers(request: TAdminListRequest): Promise<TAdminUsersListResponse> {
    try {
      return await this.client.listUsers(request);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async setUserRole(
    id: number,
    data: TUpdateUserRoleRequest
  ): Promise<TAdminUserItemResponse> {
    try {
      return await this.client.setUserRole(id, data);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }
}
