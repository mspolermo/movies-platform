import type { TFilmsResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

import { FilmListItemResponseDto } from "./filmListItemResponse.dto";

/** Swagger-схема `GET /films` (= `TFilmsResponse`). */
export class FilmsPaginationResponseDto implements TFilmsResponse {
  @ApiProperty({ type: [FilmListItemResponseDto] })
  items!: FilmListItemResponseDto[];

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  perPage!: number;

  @ApiProperty({ example: true })
  hasMore!: boolean;
}
