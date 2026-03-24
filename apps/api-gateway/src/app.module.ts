import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

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
  ],
  controllers: [AppController],
})
export class AppModule {}
