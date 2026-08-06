import type { TCommentsPaginatedResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

import { CommentResponseDto } from "./commentResponse.dto";

/** Swagger-схема `GET /comments/:filmId` (= `TCommentsPaginatedResponse`). */
export class CommentsPaginatedResponseDto implements TCommentsPaginatedResponse {
  @ApiProperty({ type: [CommentResponseDto] })
  items!: CommentResponseDto[];

  @ApiProperty({ example: 50 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  perPage!: number;

  @ApiProperty({ example: true })
  hasMore!: boolean;
}
