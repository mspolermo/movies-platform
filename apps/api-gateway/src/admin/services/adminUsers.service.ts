import type {
  TAdminListRequest,
  TAdminUserItemResponse,
  TAdminUsersListResponse,
  TUpdateUserRoleRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { fromRpc } from "../../shared";
import { AdminUsersClient } from "../clients";

/** Admin: список пользователей и смена роли (auth-users RPC). */
@Injectable()
export class AdminUsersService {
  constructor(private readonly client: AdminUsersClient) {}

  listUsers(request: TAdminListRequest): Promise<TAdminUsersListResponse> {
    return fromRpc(this.client.listUsers(request));
  }

  setUserRole(
    id: number,
    data: TUpdateUserRoleRequest
  ): Promise<TAdminUserItemResponse> {
    return fromRpc(this.client.setUserRole(id, data));
  }
}
