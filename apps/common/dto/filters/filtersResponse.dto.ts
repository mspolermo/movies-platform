import type { TFiltersResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

/** Swagger-схема `GET /filters` и `GET /filters/quick` (= `TFiltersResponse`). */
export class FiltersResponseDto implements TFiltersResponse {
  @ApiProperty({ type: [String], example: ["Драма", "Комедия"] })
  genres!: string[];

  @ApiProperty({ type: [String], example: ["Россия", "США"] })
  countries!: string[];

  @ApiProperty({ type: [Number], example: [2024, 2023, 2022] })
  years!: number[];
}
