import type { TGenreItemResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

/** Swagger-схема элемента `GET /genres` (= `TGenreItemResponse`). */
export class GenreItemResponseDto implements TGenreItemResponse {
  @ApiProperty({
    example: "Драма",
    description: "Название жанра на русском",
  })
  nameRu!: string;

  @ApiProperty({
    example: "Drama",
    description: "Название жанра на английском",
  })
  nameEn!: string;
}
