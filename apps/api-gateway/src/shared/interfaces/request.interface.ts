import { Request } from "express";
import type { TJwtUserRequest } from "@common/types";

export interface AuthenticatedRequest extends Request {
  user: TJwtUserRequest;
}
