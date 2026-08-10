import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

import { NETWORK } from "@common/constants/network";

import { Comment, CommentLike, CommentsModule } from "./comments";
import { Country, CountriesModule } from "./countries";
import { Film, FilmsModule, FilmPerson, FilmGenre, FilmCountry, Fact } from "./films";
import { Genre, GenresModule } from "./genres";
import { HealthController } from "./health";
import { Person, PersonProfession, PersonsModule } from "./persons";
import { Profession, ProfessionsModule } from "./professions";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT) || NETWORK.postgresDialPort,
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
        CommentLike,
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
})
export class AppModule {}
