import type { TSearchResultResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";


import { FilmListItemResponseDto } from "@common/dto";

import { PersonListItemResponseDto } from "../../persons/dto";

/** Swagger-схема `GET /search` (= `TSearchResultResponse`). */
export class SearchResultResponseDto implements TSearchResultResponse {
  @ApiProperty({ type: [FilmListItemResponseDto] })
  films!: FilmListItemResponseDto[];

  @ApiProperty({ type: [PersonListItemResponseDto] })
  persons!: PersonListItemResponseDto[];
}
