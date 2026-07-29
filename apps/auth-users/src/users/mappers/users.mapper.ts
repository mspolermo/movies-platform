import type {
  TAdminUserItemResponse,
  TAppRole,
  TAuthorizedUserResponse,
} from "@common/types";

import { Role } from "../../roles/models/roles.model";
import { User } from "../models/users.model";

export const toAuthorizedUserResponse = (user: User): TAuthorizedUserResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
  roles: (user.roles ?? []).map((role: Role) => ({
    id: role.id,
    value: role.value,
  })),
});

/** Приоритет «основной» роли для селекта админки (F1: одна активная роль). */
const ROLE_PRIORITY: TAppRole[] = ["ADMIN", "MANAGER", "USER"];

/** Преобразует ORM-модель пользователя в admin-ответ (roles + основная role). */
export const toAdminUserItem = (user: User): TAdminUserItemResponse => {
  const roles = (user.roles ?? []).map((role: Role) => ({
    id: role.id,
    value: role.value,
  }));
  const role =
    ROLE_PRIORITY.find((value) =>
      roles.some((userRole) => userRole.value === value)
    ) ?? "USER";

  return {
    id: user.id,
    email: user.email,
    name: user.name ?? undefined,
    roles,
    role,
  };
};
