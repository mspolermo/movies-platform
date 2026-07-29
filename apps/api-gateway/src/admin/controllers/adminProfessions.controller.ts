import type {
  TAdminProfessionsListResponse,
  TProfessionAdminItemResponse,
} from "@common/types";

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

import {
  AdminListQueryDto,
  CreateProfessionDto,
  UpdateProfessionDto,
} from "@common/dto";

import { JwtAuthGuard, Roles, RolesGuard } from "../../shared";
import { AdminProfessionsService } from "../services";

/** Admin CRUD профессий; только роль ADMIN (ADR-005). */
@Controller("admin/professions")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiBearerAuth()
export class AdminProfessionsController {
  constructor(
    private readonly adminProfessionsService: AdminProfessionsService
  ) {}

  @ApiOperation({ summary: "Список профессий (пагинация, с id)" })
  @ApiResponse({ status: 200, description: "Пагинированный список профессий" })
  @Get()
  listProfessions(
    @Query() query: AdminListQueryDto
  ): Promise<TAdminProfessionsListResponse> {
    return this.adminProfessionsService.listProfessions(query);
  }

  @ApiOperation({ summary: "Создание профессии" })
  @ApiResponse({ status: 201, description: "Созданная профессия" })
  @ApiResponse({ status: 409, description: "Дубликат названия" })
  @Post()
  createProfession(
    @Body() dto: CreateProfessionDto
  ): Promise<TProfessionAdminItemResponse> {
    return this.adminProfessionsService.createProfession(dto);
  }

  @ApiOperation({ summary: "Частичное обновление профессии" })
  @ApiResponse({ status: 200, description: "Обновлённая профессия" })
  @ApiResponse({ status: 404, description: "Не найдена" })
  @ApiResponse({ status: 409, description: "Дубликат названия" })
  @Patch("/:id")
  updateProfession(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateProfessionDto
  ): Promise<TProfessionAdminItemResponse> {
    return this.adminProfessionsService.updateProfession(id, dto);
  }

  @ApiOperation({
    summary: "Удаление профессии (Restrict при использовании персонами)",
  })
  @ApiResponse({ status: 200, description: "Удалено" })
  @ApiResponse({ status: 409, description: "Профессия используется персонами" })
  @Delete("/:id")
  deleteProfession(@Param("id", ParseIntPipe) id: number): Promise<true> {
    return this.adminProfessionsService.deleteProfession(id);
  }
}
