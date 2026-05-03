import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

import { LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT } from "@common/constants";

export class GetPersonsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(LIST_MAX_LIMIT)
  limit: number = LIST_DEFAULT_LIMIT;
}