import type { TJwtUserRequest } from "@common/types";

import { Request } from "express";

/** HTTP-запрос с типизированными данными аутентифицированного пользователя. */
export interface AuthenticatedRequest extends Request {
  user: TJwtUserRequest;
}