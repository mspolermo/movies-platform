import type { AuthDto, CreateUserDto, OauthCreateUserDto } from "@common/dto";
import type { TAuthorizedUserResponse, TRoleResponse } from "@common/types";
import type {
  TAuthUsersRpcAuthResponse,
  TAuthUsersRpcLogoutRequest,
  TAuthUsersRpcRefreshRequest,
} from "@common/types/response/auth";

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
    refresh: "refresh",
    logout: "logout",
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
    response: TAuthorizedUserResponse;
  };
  [authUsersRpc.users.refresh]: {
    request: TAuthUsersRpcRefreshRequest;
    response: TAuthUsersRpcAuthResponse;
  };
  [authUsersRpc.users.logout]: {
    request: TAuthUsersRpcLogoutRequest;
    response: true;
  };
  [authUsersRpc.roles.create]: {
    request: {
      value: string;
      description: string;
    };
    response: TRoleResponse;
  };
};
