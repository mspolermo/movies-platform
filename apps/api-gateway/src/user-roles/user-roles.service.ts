import type { TUserOrmModel } from "@common/types/orm";

import { Injectable } from "@nestjs/common";

import { RmqService, authUsersRpc } from "@common/services";

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