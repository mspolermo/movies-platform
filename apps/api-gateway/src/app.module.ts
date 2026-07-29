import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { RmqModule } from "@common/services";

import { AdminModule } from "./admin";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth";
import { CommentsModule } from "./comments";
import { CountriesModule } from "./countries";
import { FilmsModule } from "./films";
import { FiltersModule } from "./filters";
import { GenresModule } from "./genres";
import { JwtConfigModule } from "./jwt";
import { PersonsModule } from "./persons";
import { ProfessionsModule } from "./professions";
import { SearchModule } from "./search";

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
    JwtConfigModule,
    AuthModule,
    FilmsModule,
    PersonsModule,
    GenresModule,
    CommentsModule,
    SearchModule,
    FiltersModule,
    CountriesModule,
    ProfessionsModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
