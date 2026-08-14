import type { TFiltersLocale } from "@common/types";

import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString } from "class-validator";

const FILTERS_LOCALE_VALUES: readonly TFiltersLocale[] = ["ru", "en"];

export class GetFiltersQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(FILTERS_LOCALE_VALUES)
  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === null || value === "") {
      return "ru";
    }
    return value;
  })
  locale: TFiltersLocale = "ru";
}
