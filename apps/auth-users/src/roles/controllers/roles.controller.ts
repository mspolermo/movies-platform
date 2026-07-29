import { Controller, Get, Param } from "@nestjs/common";

import { RolesService } from "../services";

/** Роли только из посева (ADR-007): CRUD ролей нет, только чтение. */
@Controller("roles")
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get("/:value")
  getByValue(@Param("value") value: string) {
    return this.roleService.getRoleByValue(value);
  }
}
