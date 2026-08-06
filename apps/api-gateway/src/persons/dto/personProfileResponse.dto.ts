import type { TPersonProfileResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

import { PersonListItemResponseDto } from "./personListItemResponse.dto";
import { PersonProfessionResponseDto } from "./personProfessionResponse.dto";

/** Swagger-схема `GET /persons/:id` (= `TPersonProfileResponse`). */
export class PersonProfileResponseDto
  extends PersonListItemResponseDto
  implements TPersonProfileResponse
{
  @ApiProperty({ type: [PersonProfessionResponseDto], required: false })
  professions?: PersonProfessionResponseDto[];
}
