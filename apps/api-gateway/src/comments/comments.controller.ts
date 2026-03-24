import type { TCommentResponse, TCommentsTreeResponse } from "@common/types";

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  UsePipes,
  Req,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

import { CommentDTO } from "@common/dto";

import { JwtAuthGuard } from "../shared/guards";
import { AuthenticatedRequest } from "../shared/interfaces";
import { ValidationPipe } from "../shared/pipes";

import { CommentsService } from "./comments.service";

@Controller("comments")
@UseGuards(JwtAuthGuard) // Защищаем весь контроллер
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: "Получение комментариев по id фильма" })
  @ApiResponse({ status: 200, description: "Список комментариев" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get("/:filmId")
  async getCommentsByFilmId(@Param("filmId") filmId: number): Promise<TCommentsTreeResponse> {
    return await this.commentsService.getCommentsByFilmId(filmId);
  }

  @ApiOperation({ summary: "Создание комментария" })
  @ApiResponse({ status: 200, description: "Созданный комментарий" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @UsePipes(ValidationPipe)
  @Post("/:filmId")
  async createComment(
    @Param("filmId") filmId: number,
    @Body() dto: CommentDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<TCommentResponse> {
    const userId = req.user.id;
    return await this.commentsService.createComment(filmId, dto, userId);
  }
}
