import type { TProfessionItemResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

/** Swagger-схема элемента `GET /professions` (= `TProfessionItemResponse`). */
export class ProfessionItemResponseDto implements TProfessionItemResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "режиссёр" })
  name!: string;
}
