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
import { ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

import { CommentDTO } from "@common/dto";

import { JwtAuthGuard, Public } from "../../shared";
import { AuthenticatedRequest } from "../../shared/interfaces";
import { GetFilmCommentsQueryDto } from "../dto";
import { CommentsService } from "../services";

@Controller("comments")
@UseGuards(JwtAuthGuard) // Защищаем весь контроллер
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @ApiOperation({ summary: "Получение комментариев по id фильма" })
  @ApiResponse({ status: 200, description: "Список комментариев" })
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

  @ApiOperation({ summary: "Создание комментария" })
  @ApiResponse({ status: 200, description: "Созданный комментарий" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Post("/:filmId")
  async createComment(
    @Param("filmId", ParseIntPipe) filmId: number,
    @Body() dto: CommentDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<TCommentResponse> {
    const userId = req.user.id;
    return await this.commentsService.createComment(filmId, dto, userId);
  }

  @ApiOperation({ summary: "Toggle лайка комментария" })
  @ApiResponse({ status: 200, description: "Состояние лайка" })
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
