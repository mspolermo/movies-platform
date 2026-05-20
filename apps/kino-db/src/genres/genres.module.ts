import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Country } from "../countries";
import { Fact, FilmCountry, FilmGenre, FilmPerson, Film } from "../films";
import { Person } from "../persons";
import { Profession } from "../professions/professions.model";

import { GenresController } from "./genres.controller";
import { Genre } from "./genres.model";
import { GenresService } from "./genres.service";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Film,
      FilmPerson,
      FilmCountry,
      Fact,
      FilmGenre,
      Country,
      Genre,
      Person,
      Profession,
    ]),
  ],
  providers: [GenresService],
  controllers: [GenresController],
})
export class GenresModule {}
