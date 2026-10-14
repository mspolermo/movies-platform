import type { TFilmFactResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

/** Swagger-схема факта в деталях фильма (= `TFilmFactResponse`). */
export class FilmFactResponseDto implements TFilmFactResponse {
  @ApiProperty({ example: "FACT" })
  type!: string;

  @ApiProperty({ example: "Снимался в Исландии" })
  value!: string;

  @ApiProperty({ example: false })
  spoiler!: boolean;
}
