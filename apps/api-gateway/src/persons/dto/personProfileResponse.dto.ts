import type { TPersonProfileResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

import { PersonProfessionResponseDto } from "@common/dto";

import { PersonListItemResponseDto } from "./personListItemResponse.dto";

/** Swagger-схема `GET /persons/:id` (= `TPersonProfileResponse`). */
export class PersonProfileResponseDto
  extends PersonListItemResponseDto
  implements TPersonProfileResponse
{
  @ApiProperty({ type: [PersonProfessionResponseDto], required: false })
  professions?: PersonProfessionResponseDto[];
}
