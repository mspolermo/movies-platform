import type { TFilmDetailsResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

import { CountryItemResponseDto } from "../../countries/dto";
import { GenreItemResponseDto } from "../../genres/dto";

import { FilmFactResponseDto } from "./filmFactResponse.dto";

/** Swagger-схема `GET /films/:id` (= `TFilmDetailsResponse`). */
export class FilmDetailsResponseDto implements TFilmDetailsResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "https://cdn.example/trailer.mp4", required: false })
  trailerUrl?: string;

  @ApiProperty({ example: 8.7, required: false })
  ratingKp?: number;

  @ApiProperty({ example: 500000, required: false })
  votesKp?: number;

  @ApiProperty({ example: 148, required: false })
  movieLength?: number;

  @ApiProperty({ example: "Начало" })
  filmNameRu!: string;

  @ApiProperty({ example: "Inception", required: false })
  filmNameEn?: string;

  @ApiProperty({ example: "Описание фильма", required: false })
  description?: string;

  @ApiProperty({ example: "Your mind is the scene of the crime", required: false })
  slogan?: string;

  @ApiProperty({ example: "https://cdn.example/big.jpg", required: false })
  bigPictureUrl?: string;

  @ApiProperty({ example: "https://cdn.example/small.jpg", required: false })
  smallPictureUrl?: string;

  @ApiProperty({ example: 2010, required: false })
  year?: number;

  @ApiProperty({ type: [CountryItemResponseDto], required: false })
  countries?: CountryItemResponseDto[];

  @ApiProperty({ type: [GenreItemResponseDto], required: false })
  genres?: GenreItemResponseDto[];

  @ApiProperty({ type: [FilmFactResponseDto], required: false })
  facts?: FilmFactResponseDto[];
}
