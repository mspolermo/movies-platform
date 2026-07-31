import type {
  TUpsertFilmRatingResponse,
  TDeleteFilmRatingResponse,
  TMyFilmRatingsResponse,
  TMyFilmRatingGradesResponse,
} from "@common/types";

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

import {
  UpsertFilmRatingDto,
  UserFilmPrefsListQueryDto,
} from "@common/dto";

import { JwtAuthGuard, ParsePositiveIntPipe } from "../../shared";
import { AuthenticatedRequest } from "../../shared/interfaces";
import { RatingsService } from "../services";

@Controller("ratings")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @ApiOperation({ summary: "Список оценок пользователя (пагинация)" })
  @ApiResponse({ status: 200, description: "Пагинированный список" })
  @Get()
  list(
    @Req() req: AuthenticatedRequest,
    @Query() query: UserFilmPrefsListQueryDto
  ): Promise<TMyFilmRatingsResponse> {
    return this.ratingsService.list(req.user.id, query);
  }

  @ApiOperation({ summary: "Все оценки (hydrate панели)" })
  @ApiResponse({ status: 200, description: "filmId + grade" })
  @Get("grades")
  grades(
    @Req() req: AuthenticatedRequest
  ): Promise<TMyFilmRatingGradesResponse> {
    return this.ratingsService.grades(req.user.id);
  }

  @ApiOperation({ summary: "Поставить или изменить оценку фильма" })
  @ApiResponse({ status: 200, description: "Сохранённая оценка" })
  @Put(":filmId")
  upsert(
    @Param("filmId", ParsePositiveIntPipe) filmId: number,
    @Body() dto: UpsertFilmRatingDto,
    @Req() req: AuthenticatedRequest
  ): Promise<TUpsertFilmRatingResponse> {
    return this.ratingsService.upsert(req.user.id, filmId, dto.grade);
  }

  @ApiOperation({ summary: "Удалить оценку фильма" })
  @ApiResponse({ status: 200, description: "deleted: true|false" })
  @Delete(":filmId")
  delete(
    @Param("filmId", ParsePositiveIntPipe) filmId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<TDeleteFilmRatingResponse> {
    return this.ratingsService.delete(req.user.id, filmId);
  }
}
