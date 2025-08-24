import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard, RolesGuard } from '../shared/guards';
import { UserRolesService } from '../shared/services/user-roles.service';
import { getJwtConfig } from '../config';

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
