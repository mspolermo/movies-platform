import type { TAdminListRequest } from "@common/types";

import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

import { LIST_MAX_LIMIT } from "@common/constants";

/** Query-параметры admin-списков: пагинация + поиск (`q` — films/persons/countries/genres). */
export class AdminListQueryDto implements TAdminListRequest {
  @ApiPropertyOptional({ description: "Номер страницы", example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: "Элементов на странице", example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(LIST_MAX_LIMIT)
  perPage?: number;

  @ApiPropertyOptional({ description: "Поисковая строка (по name-полям)" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;
}
