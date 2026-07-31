import type { TListPaginationParams } from "@common/types";

import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { LIST_MAX_LIMIT } from "@common/constants";

/** Query GET /favorites и GET /ratings. */
export class UserFilmPrefsListQueryDto implements TListPaginationParams {
  @ApiPropertyOptional({ description: "Номер страницы", example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: "Элементов на странице",
    example: 20,
    maximum: LIST_MAX_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(LIST_MAX_LIMIT)
  perPage?: number;
}
