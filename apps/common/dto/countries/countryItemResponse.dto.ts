import type { TCountryItemResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

/** Swagger-схема элемента `GET /countries` (= `TCountryItemResponse`). */
export class CountryItemResponseDto implements TCountryItemResponse {
  @ApiProperty({
    example: "Россия",
    description: "Название страны на русском",
  })
  countryName!: string;

  @ApiProperty({
    example: "Russia",
    description: "Название страны на английском",
  })
  countryNameEn!: string;
}
