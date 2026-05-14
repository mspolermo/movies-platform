import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Comment } from "../comments/comments.model";
import { Country, CountriesModule } from "../countries";
import { CountriesService } from "../countries/services/countries.service";
import { Fact } from "../facts/facts.model";
import { Genre } from "../genres/genres.model";
import { GenresModule } from "../genres/genres.module";
import { GenresService } from "../genres/genres.service";
import { Person, PersonsService, PersonsModule } from "../persons";
import { Profession } from "../professions/professions.model";
import { ProfessionsModule } from "../professions/professions.module";
import { ProfessionsService } from "../professions/professions.service";

import { FilmCountry } from "./filmCountry";
import { FilmGenre } from "./filmGenre";
import { FilmPerson } from "./filmPerson";
import { FilmsController } from "./films.controller";
import { Film } from "./films.model";
import { FilmsService } from "./films.service";

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
      Comment,
    ]),
    PersonsModule,
    CountriesModule,
    GenresModule,
    ProfessionsModule,
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    PersonsService,
    CountriesService,
    GenresService,
    ProfessionsService,
  ],
})
export class FilmsModule {}
