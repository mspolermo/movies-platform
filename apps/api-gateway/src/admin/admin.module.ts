import { Module } from "@nestjs/common";

import { JwtConfigModule } from "../jwt";

import { AdminKinoDbClient, AdminUsersClient } from "./clients";
import {
  AdminCountriesController,
  AdminFilmsController,
  AdminGenresController,
  AdminPersonsController,
  AdminProfessionsController,
  AdminUsersController,
} from "./controllers";
import {
  AdminCountriesService,
  AdminFilmsService,
  AdminGenresService,
  AdminPersonsService,
  AdminProfessionsService,
  AdminUsersService,
} from "./services";

/**
 * Admin-панель (/admin/*, ADR-005): CRUD фильмов и справочников kino-db,
 * роли пользователей auth-users. Доступ — JwtAuthGuard + RolesGuard(ADMIN).
 * RmqModule — @Global, JwtConfigModule экспортирует guards и UserRolesService.
 */
@Module({
  imports: [JwtConfigModule],
  controllers: [
    AdminFilmsController,
    AdminGenresController,
    AdminCountriesController,
    AdminProfessionsController,
    AdminPersonsController,
    AdminUsersController,
  ],
  providers: [
    AdminKinoDbClient,
    AdminUsersClient,
    AdminFilmsService,
    AdminGenresService,
    AdminCountriesService,
    AdminProfessionsService,
    AdminPersonsService,
    AdminUsersService,
  ],
})
export class AdminModule {}
