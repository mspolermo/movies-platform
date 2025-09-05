import { TRoleBased } from "@common/types";

export interface AuthResponse {
  email: string;
  userId: number;
  role: TRoleBased[];
  token: string;
}
