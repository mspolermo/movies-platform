import type { TPersonFilmsPaginationResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

import { PersonFilmResponseDto } from "./personFilmResponse.dto";

/** Swagger-схема пагинированной фильмографии (= `TPersonFilmsPaginationResponse`). */
export class PersonFilmsPaginationResponseDto
  implements TPersonFilmsPaginationResponse
{
  @ApiProperty({ type: [PersonFilmResponseDto] })
  items!: PersonFilmResponseDto[];

  @ApiProperty({ example: 40 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  perPage!: number;

  @ApiProperty({ example: true })
  hasMore!: boolean;
}
