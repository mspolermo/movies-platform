import type { TPaginatedPersonsResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

import { PersonListItemResponseDto } from "./personListItemResponse.dto";

/** Swagger-схема пагинированного списка персон (= `TPaginatedPersonsResponse`). */
export class PaginatedPersonsResponseDto implements TPaginatedPersonsResponse {
  @ApiProperty({ type: [PersonListItemResponseDto] })
  items!: PersonListItemResponseDto[];

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  perPage!: number;

  @ApiProperty({ example: true })
  hasMore!: boolean;
}
