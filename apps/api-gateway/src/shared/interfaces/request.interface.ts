import { Request } from "express";
import { TUserBased } from "@common/types";

export interface AuthenticatedRequest extends Request {
  user: TUserBased;
}
