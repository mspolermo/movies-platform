import type { TAuthorizedUserResponse } from "@common/types";

import { Role } from "../roles/roles.model";
import { User } from "../users/users.model";

export const toAuthorizedUserResponse = (user: User): TAuthorizedUserResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
  roles: (user.roles ?? []).map((role: Role) => ({
    id: role.id,
    value: role.value,
  })),
});
