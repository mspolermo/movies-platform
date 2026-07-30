import type {
  TCreatePersonRequest,
  TUpdatePersonRequest,
} from "@common/types";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty, IsString } from "class-validator";

import { OptionalNullable, OptionalStrict } from "./decorators";

export class CreatePersonDto implements TCreatePersonRequest {
  @ApiProperty({ description: "Имя на русском" })
  @IsString()
  @IsNotEmpty()
  nameRu!: string;

  @ApiProperty({ description: "Имя на английском" })
  @IsString()
  @IsNotEmpty()
  nameEn!: string;

  @ApiProperty({ description: "URL фотографии (может быть пустым)" })
  @IsString()
  photoUrl!: string;

  @ApiProperty({ description: "Id профессий персоны", type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  professionIds!: number[];
}

export class UpdatePersonDto implements TUpdatePersonRequest {
  @ApiPropertyOptional({ description: "Имя на русском" })
  @OptionalStrict()
  @IsString()
  @IsNotEmpty()
  nameRu?: string;

  @ApiPropertyOptional({ description: "Имя на английском" })
  @OptionalStrict()
  @IsString()
  @IsNotEmpty()
  nameEn?: string;

  @ApiPropertyOptional({ description: "URL фотографии; null — очистить" })
  @OptionalNullable()
  @IsString()
  photoUrl?: string | null;

  @ApiPropertyOptional({ description: "Id профессий персоны", type: [Number] })
  @OptionalStrict()
  @IsArray()
  @IsInt({ each: true })
  professionIds?: number[];
}
