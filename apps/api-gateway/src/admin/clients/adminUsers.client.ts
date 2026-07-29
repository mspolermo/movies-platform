import type {
  TAdminListRequest,
  TAdminUserItemResponse,
  TAdminUsersListResponse,
  TUpdateUserRoleRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { authUsersRpc, RmqService } from "@common/services";

/** RMQ-клиент admin-операций auth-users (список пользователей, назначение роли). */
@Injectable()
export class AdminUsersClient {
  constructor(private readonly rmq: RmqService) {}

  listUsers(request: TAdminListRequest): Promise<TAdminUsersListResponse> {
    return this.rmq.sendToUsers(authUsersRpc.admin.users.list, request);
  }

  setUserRole(
    id: number,
    data: TUpdateUserRoleRequest
  ): Promise<TAdminUserItemResponse> {
    return this.rmq.sendToUsers(authUsersRpc.admin.users.setRole, { id, data });
  }
}
