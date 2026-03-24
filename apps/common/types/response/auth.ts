import type { TRoleResponse } from "./role";
import type { TUserBriefResponse, TUserTokenPayloadResponse } from "./user";

export type TAuthorizedUserResponse = TUserBriefResponse & {
  roles: TRoleResponse[];
};

export type TAuthResponse = {
  email: string;
  userId: number;
  role: TRoleResponse[];
  token: string;
};

export type TRegistrationResponse = {
  user: TAuthorizedUserResponse;
  role: TRoleResponse[];
  token: string;
};

export type TCheckTokenResponse = TUserTokenPayloadResponse;

export type TRefreshTokenResponse = {
  token: string;
};
