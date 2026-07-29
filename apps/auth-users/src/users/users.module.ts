import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Role, UserRoles } from "../roles/models";
import { RolesModule } from "../roles/roles.module";
import { TokensModule } from "../tokens/tokens.module";

import { UsersAdminController, UsersController } from "./controllers";
import { User } from "./models";
import { UsersAdminService, UsersService } from "./services";

@Module({
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService, UsersAdminService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles]),
    RolesModule,
    TokensModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
