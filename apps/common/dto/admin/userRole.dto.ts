import type { TAppRole, TUpdateUserRoleRequest } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

/** Роли из посева — единственные допустимые значения (ADR-007). */
export const APP_ROLES: readonly TAppRole[] = ["ADMIN", "USER", "MANAGER"];

/** Назначение пользователю единственной роли (админка). */
export class UpdateUserRoleDto implements TUpdateUserRoleRequest {
  @ApiProperty({ description: "Роль пользователя", enum: APP_ROLES })
  @IsIn([...APP_ROLES])
  role!: TAppRole;
}
