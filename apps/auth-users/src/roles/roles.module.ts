import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { User } from "../users/models";

import { Role, UserRoles } from "./models";
import { RolesService } from "./services";

@Module({
  providers: [RolesService],
  imports: [SequelizeModule.forFeature([Role, User, UserRoles])],
  exports: [RolesService],
})
export class RolesModule {}
