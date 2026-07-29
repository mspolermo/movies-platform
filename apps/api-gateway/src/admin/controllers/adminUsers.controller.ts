import type {
  TAdminUserItemResponse,
  TAdminUsersListResponse,
} from "@common/types";

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

import { AdminListQueryDto, UpdateUserRoleDto } from "@common/dto";

import { JwtAuthGuard, Roles, RolesGuard } from "../../shared";
import { AdminUsersService } from "../services";

/** Admin-операции над пользователями; только роль ADMIN (ADR-005). */
@Controller("admin/users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiBearerAuth()
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @ApiOperation({ summary: "Список пользователей с ролями (пагинация)" })
  @ApiResponse({ status: 200, description: "Пагинированный список пользователей" })
  @Get()
  listUsers(
    @Query() query: AdminListQueryDto
  ): Promise<TAdminUsersListResponse> {
    return this.adminUsersService.listUsers(query);
  }

  @ApiOperation({ summary: "Назначение роли пользователю" })
  @ApiResponse({ status: 200, description: "Обновлённый пользователь" })
  @ApiResponse({ status: 404, description: "Пользователь не найден" })
  @ApiResponse({ status: 409, description: "Последний ADMIN" })
  @Patch("/:id")
  setUserRole(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto
  ): Promise<TAdminUserItemResponse> {
    return this.adminUsersService.setUserRole(id, dto);
  }
}
