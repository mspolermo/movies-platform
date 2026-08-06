import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { getJwtConfig } from "../config";
import { JwtAuthGuard, RolesGuard } from "../shared/guards";
import { UserRolesService } from "../user-roles";

/** Global: JwtAuthGuard / RolesGuard доступны во всех feature-модулях без повторного import. */
@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        getJwtConfig(configService),
      inject: [ConfigService],
      global: true,
    }),
  ],
  providers: [JwtAuthGuard, RolesGuard, UserRolesService],
  exports: [JwtModule, JwtAuthGuard, RolesGuard, UserRolesService],
})
export class JwtConfigModule {}
