import { GUARDS_METADATA } from "@nestjs/common/constants";

import { JwtAuthGuard, ROLES_KEY, RolesGuard } from "../../shared";
import {
  AdminCountriesController,
  AdminFilmsController,
  AdminGenresController,
  AdminPersonsController,
  AdminProfessionsController,
  AdminUsersController,
} from "../controllers";

/**
 * RBAC-проводка admin-контроллеров: на каждом классе висят
 * JwtAuthGuard + RolesGuard и метаданные @Roles("ADMIN") под ROLES_KEY —
 * иначе RolesGuard молча пропустит запрос без проверки роли.
 */
describe("Admin controllers RBAC wiring", () => {
  const controllers = [
    AdminFilmsController,
    AdminGenresController,
    AdminCountriesController,
    AdminProfessionsController,
    AdminPersonsController,
    AdminUsersController,
  ];

  it.each(controllers.map((controller) => [controller.name, controller]))(
    "%s requires JwtAuthGuard + RolesGuard and ADMIN role",
    (_name, controller) => {
      const guards = Reflect.getMetadata(GUARDS_METADATA, controller) as
        | unknown[]
        | undefined;
      expect(guards).toEqual([JwtAuthGuard, RolesGuard]);

      const roles = Reflect.getMetadata(ROLES_KEY, controller) as
        | string[]
        | undefined;
      expect(roles).toEqual(["ADMIN"]);
    }
  );
});
