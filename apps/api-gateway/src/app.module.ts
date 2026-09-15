import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { RmqModule } from "@common/services";

import { AdminModule } from "./admin";
import { AuthModule } from "./auth";
import { CommentsModule } from "./comments";
import { CountriesModule } from "./countries";
import { FavoritesModule } from "./favorites";
import { FilmsModule } from "./films";
import { FiltersModule } from "./filters";
import { GenresModule } from "./genres";
import { HealthModule } from "./health";
import { PersonsModule } from "./persons";
import { ProfessionsModule } from "./professions";
import { RatingsModule } from "./ratings";
import { SearchModule } from "./search";
import { SecurityModule } from "./security";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    // rate limiting (ограничение количества запросов) на брутфорс, спам регистраций, подбор пароля и пр.
    // Nest throttler v6+: ttl в миллисекундах, forRoot принимает массив throttlers
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
    RmqModule,
    SecurityModule,
    HealthModule,
    AuthModule,
    FilmsModule,
    PersonsModule,
    GenresModule,
    CommentsModule,
    FavoritesModule,
    RatingsModule,
    SearchModule,
    FiltersModule,
    CountriesModule,
    ProfessionsModule,
    AdminModule,
  ],
})
export class AppModule {}
