import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

import { Comment } from "./comments/comments.model";
import { CommentsModule } from "./comments/comments.module";
import { Country } from "./countries/countries.model";
import { CountriesModule } from "./countries/countries.module";
import { Fact } from "./facts/facts.model";
import { FilmCountry } from "./films/filmCountry";
import { FilmGenre } from "./films/filmGenre";
import { FilmPerson } from "./films/filmPerson";
import { Film } from "./films/films.model";
import { FilmsModule } from "./films/films.module";
import { Genre } from "./genres/genres.model";
import { GenresModule } from "./genres/genres.module";
import { HealthController } from "./health.controller";
import { PersonProfession } from "./persons/personProfession";
import { Person } from "./persons/persons.model";
import { PersonsModule } from "./persons/persons.module";
import { Profession } from "./professions/professions.model";
import { ProfessionsModule } from "./professions/professions.module";

@Module({
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
        Genre,
        Fact,
        Country,
        Film,
        Person,
        Profession,
        FilmGenre,
        FilmCountry,
        FilmPerson,
        PersonProfession,
        Comment,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    GenresModule,
    CountriesModule,
    ProfessionsModule,
    PersonsModule,
    FilmsModule,
    CommentsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
