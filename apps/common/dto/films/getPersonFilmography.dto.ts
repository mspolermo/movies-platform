import { Type } from "class-transformer";
import { IsInt, Min, Max, IsOptional } from "class-validator";

import { LIST_MAX_LIMIT } from "@common/constants";

export class GetPersonFilmographyDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id!: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(LIST_MAX_LIMIT)
  limit?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}