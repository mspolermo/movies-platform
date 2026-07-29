import type { TCreateGenreRequest, TUpdateGenreRequest } from "@common/types";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { OptionalStrict } from "./decorators";

/** Создание жанра (админка). */
export class CreateGenreDto implements TCreateGenreRequest {
  @ApiProperty({ description: "Название на русском" })
  @IsString()
  @IsNotEmpty()
  nameRu!: string;

  @ApiProperty({ description: "Название на английском" })
  @IsString()
  @IsNotEmpty()
  nameEn!: string;
}

/** Частичное обновление жанра (админка). */
export class UpdateGenreDto implements TUpdateGenreRequest {
  @ApiPropertyOptional({ description: "Название на русском" })
  @OptionalStrict()
  @IsString()
  @IsNotEmpty()
  nameRu?: string;

  @ApiPropertyOptional({ description: "Название на английском" })
  @OptionalStrict()
  @IsString()
  @IsNotEmpty()
  nameEn?: string;
}
