import type { TRoleBased } from "../role";
import type { TUserBased } from "../user";

export type TRoleResponse = Pick<TRoleBased, "id" | "value" | "description">;

export type TAuthorizedUserResponse = Pick<
  TUserBased,
  "id" | "email" | "name"
> & {
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

export type TCheckTokenResponse = Pick<TUserBased, "id" | "email">;

export interface TRefreshTokenResponse {
  token: string;
}
