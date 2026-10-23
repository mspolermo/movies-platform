import type { TPersonFilmResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

/** Swagger-схема фильма в фильмографии (= `TPersonFilmResponse`). */
export class PersonFilmResponseDto implements TPersonFilmResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "https://cdn.example/poster.jpg", required: false })
  smallPictureUrl?: string;

  @ApiProperty({ example: "Начало" })
  filmNameRu!: string;

  @ApiProperty({ example: "Inception", required: false })
  filmNameEn?: string;

  @ApiProperty({ example: 2010, required: false })
  year?: number;

  @ApiProperty({ example: 8.7, required: false })
  ratingKp?: number;
}
