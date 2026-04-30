import type { AuthDto, CreateUserDto, OauthCreateUserDto } from "@common/dto";
import type { TRoleResponse } from "@common/types";
import type { TUserOrmModel } from "@common/types/orm";
import type { TAuthUsersRpcAuthResponse } from "@common/types/response/auth";

//TODO: когда будет авторизация - переделать на правильные типы, сейчас полу-костыль

/**
 * Паттерны сообщений RabbitMQ для микросервиса auth-users.
 * Значения строк не менять без согласования — это контракт с api-gateway.
 */
export const authUsersRpc = {
  health: {
    ping: "health.ping",
  },
  users: {
    registration: "registration",
    outRegistration: "outRegistration",
    login: "login",
    getById: "getUserById",
  },
  roles: {
    create: "createRole",
  },
} as const;

export type TAuthUsersRpcContract = {
  [authUsersRpc.health.ping]: {
    request: Record<string, never>;
    response: true;
  };
  [authUsersRpc.users.registration]: {
    request: CreateUserDto;
    response: TAuthUsersRpcAuthResponse;
  };
  [authUsersRpc.users.outRegistration]: {
    request: OauthCreateUserDto;
    response: TAuthUsersRpcAuthResponse;
  };
  [authUsersRpc.users.login]: {
    request: AuthDto;
    response: TAuthUsersRpcAuthResponse;
  };
  [authUsersRpc.users.getById]: {
    request: number;
    response: TUserOrmModel;
  };
  [authUsersRpc.roles.create]: {
    request: {
      value: string;
      description: string;
    };
    response: TRoleResponse;
  };
};
