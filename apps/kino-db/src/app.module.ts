import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { GenresModule } from "./genres/genres.module";
import { CountriesModule } from "./countries/countries.module";
import { ProfessionsModule } from "./professions/professions.module";
import { PersonsModule } from "./persons/persons.module";
import { FilmsModule } from "./films/films.module";
import { Fact } from "./facts/facts.model";
import { Film } from "./films/films.model";
import { Profession } from "./professions/professions.model";
import { FilmGenre } from "./films/filmGenre";
import { FilmCountry } from "./films/filmCountry";
import { FilmPerson } from "./films/filmPerson";
import { PersonProfession } from "./persons/personProfession";
import { CommentsModule } from "./comments/comments.module";
import { Comment } from "./comments/comments.model";
import { HealthController } from "./health.controller";
import { Genre } from "./genres/genres.model";
import { Country } from "./countries/countries.model";
import { Person } from "./persons/persons.model";

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
