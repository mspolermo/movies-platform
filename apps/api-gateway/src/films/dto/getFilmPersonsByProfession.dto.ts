import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

import { ToInt} from "../../shared";

export class GetFilmPersonsByProfessionDto {
  @ApiProperty({
    example: "actor",
  })
  @IsString()
  profession!: string;

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @ToInt(1)
  page?: number;

  @ApiProperty({
    required: false,
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @ToInt(20)
  limit?: number;
}