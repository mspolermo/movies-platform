import type { TFilmListItemResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

/** Swagger-схема элемента списка фильмов (= `TFilmListItemResponse`). */
export class FilmListItemResponseDto implements TFilmListItemResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "Начало" })
  filmNameRu!: string;

  @ApiProperty({ example: "Inception", required: false })
  filmNameEn?: string;

  @ApiProperty({ example: "https://cdn.example/big.jpg", required: false })
  bigPictureUrl?: string;

  @ApiProperty({ example: "https://cdn.example/small.jpg", required: false })
  smallPictureUrl?: string;

  @ApiProperty({ example: 8.7, required: false })
  ratingKp?: number;

  @ApiProperty({ example: 2010, required: false })
  year?: number;

  @ApiProperty({ example: "США", required: false })
  premiereCountry?: string;

  @ApiProperty({ example: 148, required: false })
  movieLength?: number;
}
