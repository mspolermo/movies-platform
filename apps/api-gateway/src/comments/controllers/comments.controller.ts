import type {
  TCommentResponse,
  TCommentsPaginatedResponse,
  TToggleCommentLikeResponse,
} from "@common/types";

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

import { CommentDTO } from "@common/dto";

import { JwtAuthGuard, Public } from "../../shared";
import { AuthenticatedRequest } from "../../shared/interfaces";
import {
  CommentResponseDto,
  CommentsPaginatedResponseDto,
  GetFilmCommentsQueryDto,
  ToggleCommentLikeResponseDto,
} from "../dto";
import { CommentsService } from "../services";

@Controller("comments")
@UseGuards(JwtAuthGuard) // Защищаем весь контроллер; GET — @Public (optional Bearer)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @ApiOperation({ summary: "Получение комментариев по id фильма" })
  @ApiOkResponse({
    description: "Список комментариев",
    type: CommentsPaginatedResponseDto,
  })
  @Get("/:filmId")
  async getCommentsByFilmId(
    @Param("filmId", ParseIntPipe) filmId: number,
    @Query() query: GetFilmCommentsQueryDto,
    @Req() req: AuthenticatedRequest
  ): Promise<TCommentsPaginatedResponse> {
    return await this.commentsService.getCommentsByFilmId({
      filmId,
      page: query.page,
      perPage: query.perPage,
      userId: req.user?.id,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Создание комментария" })
  @ApiOkResponse({
    description: "Созданный комментарий",
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Post("/:filmId")
  async createComment(
    @Param("filmId", ParseIntPipe) filmId: number,
    @Body() dto: CommentDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<TCommentResponse> {
    return await this.commentsService.createComment(
      filmId,
      dto,
      req.user.id,
      req.user.email
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Toggle лайка комментария" })
  @ApiOkResponse({
    description: "Состояние лайка",
    type: ToggleCommentLikeResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Post("/:commentId/like")
  async toggleCommentLike(
    @Param("commentId", ParseIntPipe) commentId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<TToggleCommentLikeResponse> {
    const userId = req.user.id;
    return await this.commentsService.toggleCommentLike(commentId, userId);
  }
}
