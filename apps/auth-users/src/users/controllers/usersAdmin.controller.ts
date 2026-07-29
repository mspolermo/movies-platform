import type {
  TAdminListRequest,
  TAdminSetUserRoleRpcRequest,
  TAdminUserItemResponse,
  TAdminUsersListResponse,
} from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { authUsersRpc } from "@common/services";

import { UsersAdminService } from "../services";

/** RPC-хендлеры admin-операций над пользователями; авторизация — на gateway (ADR-005). */
@Controller("admin-users")
export class UsersAdminController {
  constructor(private readonly usersAdminService: UsersAdminService) {}

  @MessagePattern(authUsersRpc.admin.users.list)
  listUsers(
    @Payload() request: TAdminListRequest
  ): Promise<TAdminUsersListResponse> {
    return this.usersAdminService.listUsers(request);
  }

  @MessagePattern(authUsersRpc.admin.users.setRole)
  setUserRole(
    @Payload() request: TAdminSetUserRoleRpcRequest
  ): Promise<TAdminUserItemResponse> {
    return this.usersAdminService.setUserRole(request.id, request.data);
  }
}
