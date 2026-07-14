import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Role } from "../roles/roles.model";
import { RolesModule } from "../roles/roles.module";
import { UserRoles } from "../roles/user-role";
import { TokensModule } from "../tokens/tokens.module";

import { UsersController } from "./users.controller";
import { User } from "./users.model";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles]),
    RolesModule,
    TokensModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
