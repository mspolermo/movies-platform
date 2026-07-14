import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

import { HealthController } from "./health.controller";
import { Role } from "./roles/roles.model";
import { RolesModule } from "./roles/roles.module";
import { UserRoles } from "./roles/user-role";
import { RefreshToken } from "./tokens/refresh-token.model";
import { User } from "./users/users.model";
import { UsersModule } from "./users/users.module";

@Module({
  providers: [],
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, RefreshToken],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
  ],
})
export class AppModule {}
