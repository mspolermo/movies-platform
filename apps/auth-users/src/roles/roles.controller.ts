import { Controller, Get, Param } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { authUsersRpc } from "@common/messaging";

import { CreateRoleDto } from "./dto/createRoleDto";
import { RolesService } from "./roles.service";

@Controller("roles")
export class RolesController {
  constructor(private roleService: RolesService) {}

  @MessagePattern(authUsersRpc.roles.create)
  async registration(@Payload() dto: CreateRoleDto) {
    return await this.roleService.createRole(dto);
  }

  @Get("/:value")
  getByValue(@Param("value") value: string) {
    return this.roleService.getRoleByValue(value);
  }
}
