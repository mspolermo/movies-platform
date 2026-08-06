import type { TCurrentUserResponse, TRoleResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

/** Swagger-схема роли в `GET /auth/me`. */
class RoleResponseDto implements TRoleResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "USER" })
  value!: string;

  @ApiProperty({ example: "Обычный пользователь", required: false })
  description?: string;
}

/** Swagger-схема `GET /auth/me` (= `TCurrentUserResponse`). */
export class CurrentUserResponseDto implements TCurrentUserResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "user@example.com" })
  email!: string;

  @ApiProperty({ example: "Иван", required: false })
  name?: string;

  @ApiProperty({ type: [RoleResponseDto] })
  roles!: RoleResponseDto[];
}
