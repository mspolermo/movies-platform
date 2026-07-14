import type { TRoleResponse } from "./role";
import type { TUserBriefResponse } from "./user";

export type TAuthorizedUserResponse = TUserBriefResponse & {
  roles: TRoleResponse[];
};

/** Ответ login / registration / refresh. */
export type TAuthResponse = {
  user: TAuthorizedUserResponse;
  accessToken: string;
};

/** Алиас для registration — тот же контракт, что и login. */
export type TRegistrationResponse = TAuthResponse;

/** Ответ refresh — тот же контракт. */
export type TRefreshTokenResponse = TAuthResponse;

/** Текущий пользователь (GET /auth/me). */
export type TCurrentUserResponse = TAuthorizedUserResponse;

/** Ответ auth-users по RMQ после login / registration. */
export type TAuthUsersRpcAuthResponse = {
  user: TAuthorizedUserResponse;
  accessToken: string;
  refreshToken: string;
};

/** Запрос refresh по RMQ. */
export type TAuthUsersRpcRefreshRequest = {
  refreshToken: string;
};

/** Запрос logout по RMQ. */
export type TAuthUsersRpcLogoutRequest = {
  refreshToken: string;
};
