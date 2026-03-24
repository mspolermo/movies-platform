import type { TJwtUserRequest } from "@common/types";

import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: TJwtUserRequest;
}
