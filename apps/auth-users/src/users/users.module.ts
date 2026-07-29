import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Role, UserRoles } from "../roles/models";
import { RolesModule } from "../roles/roles.module";
import { TokensModule } from "../tokens/tokens.module";

import { UsersController } from "./controllers";
import { User } from "./models";
import { UsersService } from "./services";

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
