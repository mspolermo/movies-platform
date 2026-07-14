import type { TAuthorizedUserResponse } from "@common/types";

import { Injectable } from "@nestjs/common";

import { RmqService, authUsersRpc } from "@common/services";

@Injectable()
export class UserRolesService {
  constructor(private readonly rmq: RmqService) {}

  async getUserWithRoles(userId: number): Promise<TAuthorizedUserResponse> {
    return this.rmq.sendToUsers(authUsersRpc.users.getById, userId);
  }
}
