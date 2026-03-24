import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";

import { Role } from "../roles/roles.model";
import { RolesModule } from "../roles/roles.module";
import { UserRoles } from "../roles/user-role";

import { UsersController } from "./users.controller";
import { User } from "./users.model";
import { UsersService } from "./users.service";




@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles]),
    RolesModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRET",
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || "2h",
      },
    }),
  ],
  exports: [UsersService, JwtModule],
})
export class UsersModule {}
