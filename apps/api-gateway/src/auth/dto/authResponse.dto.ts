import type { TAuthResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

import { CurrentUserResponseDto } from "./currentUserResponse.dto";

/** Swagger-схема login / registration / refresh (= `TAuthResponse`). */
export class AuthResponseDto implements TAuthResponse {
  @ApiProperty({ type: CurrentUserResponseDto })
  user!: CurrentUserResponseDto;

  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "Access JWT",
  })
  accessToken!: string;
}
