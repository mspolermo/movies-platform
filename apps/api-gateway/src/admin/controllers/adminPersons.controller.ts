import type {
  TAdminPersonsListResponse,
  TAdminPersonItemResponse,
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
  CreatePersonDto,
  UpdatePersonDto,
} from "@common/dto";

import { JwtAuthGuard, Roles, RolesGuard } from "../../shared";
import { AdminPersonsService } from "../services";

@Controller("admin/persons")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiBearerAuth()
export class AdminPersonsController {
  constructor(private readonly adminPersonsService: AdminPersonsService) {}

  @ApiOperation({ summary: "Список персон (пагинация + серверный поиск q)" })
  @ApiResponse({ status: 200, description: "Пагинированный список персон" })
  @Get()
  listPersons(
    @Query() query: AdminListQueryDto
  ): Promise<TAdminPersonsListResponse> {
    return this.adminPersonsService.listPersons(query);
  }

  @ApiOperation({ summary: "Персона по id (с professionIds)" })
  @ApiResponse({ status: 200, description: "Персона" })
  @ApiResponse({ status: 404, description: "Не найдена" })
  @Get("/:id")
  getPersonById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<TAdminPersonItemResponse> {
    return this.adminPersonsService.getPersonById(id);
  }

  @ApiOperation({ summary: "Создание персоны" })
  @ApiResponse({ status: 201, description: "Созданная персона" })
  @ApiResponse({ status: 400, description: "Несуществующие professionIds" })
  @Post()
  createPerson(
    @Body() dto: CreatePersonDto
  ): Promise<TAdminPersonItemResponse> {
    return this.adminPersonsService.createPerson(dto);
  }

  @ApiOperation({
    summary: "Частичное обновление персоны (photoUrl: null — очистить)",
  })
  @ApiResponse({ status: 200, description: "Обновлённая персона" })
  @ApiResponse({ status: 404, description: "Не найдена" })
  @Patch("/:id")
  updatePerson(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePersonDto
  ): Promise<TAdminPersonItemResponse> {
    return this.adminPersonsService.updatePerson(id, dto);
  }

  @ApiOperation({ summary: "Удаление персоны (Restrict при участии в фильмах)" })
  @ApiResponse({ status: 200, description: "Удалено" })
  @ApiResponse({ status: 409, description: "Персона участвует в фильмах" })
  @Delete("/:id")
  deletePerson(@Param("id", ParseIntPipe) id: number): Promise<true> {
    return this.adminPersonsService.deletePerson(id);
  }
}
