import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Fact } from "../facts/facts.model";
import { FilmCountry } from "../films/filmCountry";
import { FilmGenre } from "../films/filmGenre";
import { FilmPerson } from "../films/filmPerson";
import { Film } from "../films/films.model";
import { Genre } from "../genres/genres.model";
import { Person } from "../persons";

import { CountriesController } from "./countries.controller";
import { Country } from "./countries.model";
import { CountriesService } from "./countries.service";

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
    ]),
  ],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
