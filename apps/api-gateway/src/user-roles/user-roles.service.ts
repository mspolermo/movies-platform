import type { TUserOrmModel } from "@common/types/orm";

import { Injectable } from "@nestjs/common";

import { authUsersRpc } from "@common/messaging";
import { RmqService } from "@common/services";

@Injectable()
export class UserRolesService {
  constructor(private readonly rmq: RmqService) {}

  async getUserWithRoles(userId: number): Promise<TUserOrmModel> {
    return this.rmq.sendToUsers<TUserOrmModel>(
      authUsersRpc.users.getById,
      userId
    );
  }
}