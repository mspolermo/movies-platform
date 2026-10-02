import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT } from "@common/constants";

export class GetFilmCommentsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  filmId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(LIST_MAX_LIMIT)
  perPage: number = LIST_DEFAULT_LIMIT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;
}
