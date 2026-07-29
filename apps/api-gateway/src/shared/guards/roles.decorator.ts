import type { TAppRole } from "@common/types";

import { SetMetadata } from "@nestjs/common";

/** Ключ метаданных ролей — ровно та строка, которую читает {@link RolesGuard}. */
export const ROLES_KEY = "roles";

/** Требуемые роли маршрута; проверяет `RolesGuard` (вместе с `JwtAuthGuard`). */
export const Roles = (...roles: TAppRole[]) => SetMetadata(ROLES_KEY, roles);
