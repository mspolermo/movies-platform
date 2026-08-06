import type { TToggleCommentLikeResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

/** Swagger-схема `POST /comments/:commentId/like` (= `TToggleCommentLikeResponse`). */
export class ToggleCommentLikeResponseDto implements TToggleCommentLikeResponse {
  @ApiProperty({ example: true })
  liked!: boolean;

  @ApiProperty({ example: 11 })
  likesCount!: number;
}
