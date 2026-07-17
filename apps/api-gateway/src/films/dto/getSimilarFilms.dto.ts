import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

import { ToInt } from "../../shared";

export class GetSimilarFilmsDto {
  @ApiProperty({
    required: false,
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @ToInt(20)
  limit?: number;
}
