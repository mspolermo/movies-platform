import type {
  TCreateCountryRequest,
  TUpdateCountryRequest,
} from "@common/types";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { OptionalStrict } from "./decorators";

export class CreateCountryDto implements TCreateCountryRequest {
  @ApiProperty({ description: "Название на русском" })
  @IsString()
  @IsNotEmpty()
  countryName!: string;

  @ApiProperty({ description: "Название на английском" })
  @IsString()
  @IsNotEmpty()
  countryNameEn!: string;
}

export class UpdateCountryDto implements TUpdateCountryRequest {
  @ApiPropertyOptional({ description: "Название на русском" })
  @OptionalStrict()
  @IsString()
  @IsNotEmpty()
  countryName?: string;

  @ApiPropertyOptional({ description: "Название на английском" })
  @OptionalStrict()
  @IsString()
  @IsNotEmpty()
  countryNameEn?: string;
}
