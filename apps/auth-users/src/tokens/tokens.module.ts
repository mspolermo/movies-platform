import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";

import { getJwtModuleConfig } from "../config/jwt.config";
import { User } from "../users/models";

import { RefreshToken } from "./models";
import { TokensService } from "./services";

@Module({
  imports: [
    SequelizeModule.forFeature([RefreshToken, User]),
    JwtModule.register(getJwtModuleConfig()),
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
