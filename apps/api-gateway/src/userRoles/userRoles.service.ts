import type { TAuthorizedUserResponse } from "@common/types";

import { Injectable } from "@nestjs/common";

import { RmqService, authUsersRpc } from "@common/services";

import { fromRpc } from "../shared/helpers";

@Injectable()
export class UserRolesService {
  constructor(private readonly rmq: RmqService) {}

  getUserWithRoles(userId: number): Promise<TAuthorizedUserResponse> {
    return fromRpc(
      this.rmq.sendToUsers(authUsersRpc.users.getById, userId)
    );
  }
}
