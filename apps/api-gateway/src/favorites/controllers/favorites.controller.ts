import type {
  TToggleFavoriteResponse,
  TMyFavoritesResponse,
  TMyFavoriteIdsResponse,
} from "@common/types";

import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

import { UserFilmPrefsListQueryDto } from "@common/dto";

import { JwtAuthGuard, ParsePositiveIntPipe } from "../../shared";
import { AuthenticatedRequest } from "../../shared/interfaces";
import { FavoritesService } from "../services";

@Controller("favorites")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: "Список избранного (пагинация)" })
  @ApiResponse({ status: 200, description: "Пагинированный список" })
  @Get()
  list(
    @Req() req: AuthenticatedRequest,
    @Query() query: UserFilmPrefsListQueryDto
  ): Promise<TMyFavoritesResponse> {
    return this.favoritesService.list(req.user.id, query);
  }

  @ApiOperation({ summary: "Все filmId избранного (hydrate панели)" })
  @ApiResponse({ status: 200, description: "Список filmId" })
  @Get("ids")
  ids(@Req() req: AuthenticatedRequest): Promise<TMyFavoriteIdsResponse> {
    return this.favoritesService.ids(req.user.id);
  }

  @ApiOperation({ summary: "Toggle избранного по filmId" })
  @ApiResponse({ status: 200, description: "Состояние избранного" })
  @Post(":filmId")
  toggle(
    @Param("filmId", ParsePositiveIntPipe) filmId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<TToggleFavoriteResponse> {
    return this.favoritesService.toggle(req.user.id, filmId);
  }
}
