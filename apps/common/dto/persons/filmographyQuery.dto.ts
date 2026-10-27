import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsInt, Max, Min } from "class-validator";

import { LIST_MAX_LIMIT } from "@common/constants";

export class FilmographyQueryDto {
  @ApiPropertyOptional({
    description: "Размер страницы",
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(LIST_MAX_LIMIT)
  limit?: number;

  @ApiPropertyOptional({
    description: "Смещение (offset)",
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
