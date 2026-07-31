import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

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
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
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
    }),
    UsersModule,
    RolesModule,
    FavoritesModule,
    RatingsModule,
  ],
})
export class AppModule {}
