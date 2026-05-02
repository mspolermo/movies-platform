import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsInt, Max, Min } from "class-validator";

import { LIST_MAX_LIMIT } from "@common/constants";

export class ProfessionPersonsQueryDto {
  @ApiPropertyOptional({
    description: "Номер страницы",
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: "Количество элементов на странице",
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(LIST_MAX_LIMIT)
  limit?: number;
}
