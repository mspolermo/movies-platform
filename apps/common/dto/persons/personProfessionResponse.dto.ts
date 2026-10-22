import type { TPersonProfessionResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

/** Swagger-схема профессии в профиле персоны (= `TPersonProfessionResponse`). */
export class PersonProfessionResponseDto implements TPersonProfessionResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "режиссёр" })
  name!: string;
}
