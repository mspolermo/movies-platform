import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

import { NETWORK } from "@common/constants/network";
import { assertPostgresCredentialsForProduction } from "@common/services/rmq/rmq.constants";

import { FavoritesModule, UserFavorite } from "./favorites";
import { HealthController } from "./health";
import { RatingsModule, UserFilmRating } from "./ratings";
import { Role, UserRoles, RolesModule } from "./roles";
import { RefreshToken } from "./tokens";
import { User, UsersModule } from "./users";

@Module({
  providers: [],
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    SequelizeModule.forRootAsync({
      useFactory: () => {
        const username = (process.env.POSTGRES_USER || "").trim() || undefined;
        const password =
          (process.env.POSTGRES_PASSWORD || "").trim() || undefined;
        assertPostgresCredentialsForProduction(
          username,
          password,
          process.env.NODE_ENV
        );

        return {
          dialect: "postgres" as const,
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT) || NETWORK.postgresDialPort,
          username,
          password,
          database: process.env.POSTGRES_DB,
          models: [
            User,
            Role,
            UserRoles,
            RefreshToken,
            UserFavorite,
            UserFilmRating,
          ],
          autoLoadModels: true,
          synchronize: true,
        };
      },
    }),
    UsersModule,
    RolesModule,
    FavoritesModule,
    RatingsModule,
  ],
})
export class AppModule {}
