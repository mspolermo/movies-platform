import type { TCommentResponse } from "@common/types";

import { ApiProperty } from "@nestjs/swagger";

/** Swagger-схема комментария (= `TCommentResponse`). */
export class CommentResponseDto implements TCommentResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "Отличный фильм" })
  title!: string;

  @ApiProperty({ example: "Очень понравилось" })
  text!: string;

  @ApiProperty({ example: 42 })
  authorId!: number;

  @ApiProperty({ example: "Иван" })
  authorName!: string;

  @ApiProperty({ example: 1 })
  filmId!: number;

  @ApiProperty({ example: "2024-01-15T12:00:00.000Z" })
  createdAt!: string;

  @ApiProperty({ example: 10 })
  likesCount!: number;

  @ApiProperty({
    example: true,
    required: false,
    description: "Только для авторизованного пользователя",
  })
  liked?: boolean;
}
