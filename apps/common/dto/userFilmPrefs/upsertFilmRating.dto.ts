import type { TUpsertFilmRatingRequest } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

import {
  FILM_USER_GRADE_MAX,
  FILM_USER_GRADE_MIN,
} from "@common/constants";

/** Body PUT /ratings/:filmId. */
export class UpsertFilmRatingDto implements TUpsertFilmRatingRequest {
  @ApiProperty({
    description: "Оценка фильма",
    example: 8,
    minimum: FILM_USER_GRADE_MIN,
    maximum: FILM_USER_GRADE_MAX,
  })
  @Type(() => Number)
  @IsInt()
  @Min(FILM_USER_GRADE_MIN)
  @Max(FILM_USER_GRADE_MAX)
  grade!: number;
}
