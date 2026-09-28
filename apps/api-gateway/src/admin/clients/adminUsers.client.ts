import type {
  TListRequest,
  TAdminUserItemResponse,
  TAdminUsersListResponse,
  TUpdateUserRoleRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { authUsersRpc, RmqService } from "@common/services";

@Injectable()
export class AdminUsersClient {
  constructor(private readonly rmq: RmqService) {}

  listUsers(request: TListRequest): Promise<TAdminUsersListResponse> {
    return this.rmq.sendToUsers(authUsersRpc.admin.users.list, request);
  }

  setUserRole(
    id: number,
    data: TUpdateUserRoleRequest
  ): Promise<TAdminUserItemResponse> {
    return this.rmq.sendToUsers(authUsersRpc.admin.users.setRole, { id, data });
  }
}
