import { TUserBased, TRoleBased } from "@common/types";

export interface RegistrationResponse {
  User: TUserBased;
  role: TRoleBased[];
  token: string;
}
