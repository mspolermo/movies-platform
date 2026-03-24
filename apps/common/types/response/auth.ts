import type { TRoleResponse } from "./role";
import type { TUserBriefResponse, TUserTokenPayloadResponse } from "./user";

export type TAuthorizedUserResponse = TUserBriefResponse & {
  roles: TRoleResponse[];
};

export interface TAuthResponse {
  email: string;
  userId: number;
  role: TRoleResponse[];
  token: string;
}

export interface TRegistrationResponse {
  user: TAuthorizedUserResponse;
  role: TRoleResponse[];
  token: string;
}

export type TCheckTokenResponse = TUserTokenPayloadResponse;

export interface TRefreshTokenResponse {
  token: string;
}
