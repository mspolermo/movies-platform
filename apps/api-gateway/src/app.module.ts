import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { JwtConfigModule } from "./jwt";
import { AuthModule } from "./auth";
import { FilmsModule } from "./films";
import { PersonsModule } from "./persons";
import { GenresModule } from "./genres";
import { CommentsModule } from "./comments";
import { SearchModule } from "./search";
import { FiltersModule } from "./filters";
import { CountriesModule } from "./countries";
import { ProfessionsModule } from "./professions";

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
