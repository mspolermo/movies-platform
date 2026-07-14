import type {
  TAuthUsersRpcAuthResponse,
  TCurrentUserResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { AuthDto, CreateUserDto } from "@common/dto";
import { RmqService, authUsersRpc } from "@common/services";

/** RMQ-клиент к auth-users (очередь USERS_QUEUE). */
@Injectable()
export class AuthClient {
  constructor(private readonly rmq: RmqService) {}

  ping(): Promise<unknown> {
    return this.rmq.sendToUsers(authUsersRpc.health.ping, {});
  }

  registration(dto: CreateUserDto): Promise<TAuthUsersRpcAuthResponse> {
    return this.rmq.sendToUsers(authUsersRpc.users.registration, dto);
  }

  login(dto: AuthDto): Promise<TAuthUsersRpcAuthResponse> {
    return this.rmq.sendToUsers(authUsersRpc.users.login, dto);
  }

  refresh(refreshToken: string): Promise<TAuthUsersRpcAuthResponse> {
    return this.rmq.sendToUsers(authUsersRpc.users.refresh, { refreshToken });
  }

  logout(refreshToken: string): Promise<true> {
    return this.rmq.sendToUsers(authUsersRpc.users.logout, { refreshToken });
  }

  getUserById(userId: number): Promise<TCurrentUserResponse> {
    return this.rmq.sendToUsers(authUsersRpc.users.getById, userId);
  }
}
