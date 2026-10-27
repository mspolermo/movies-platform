import type { TPersonListItemResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

/** Swagger-схема элемента списка персон (= `TPersonListItemResponse`). */
export class PersonListItemResponseDto implements TPersonListItemResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "https://cdn.example/photo.jpg" })
  photoUrl!: string;

  @ApiProperty({ example: "Кристофер Нолан" })
  nameRu!: string;

  @ApiProperty({ example: "Christopher Nolan" })
  nameEn!: string;
}
