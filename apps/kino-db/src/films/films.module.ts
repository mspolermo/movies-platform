import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Comment } from "../comments/comments.model";
import { Country, CountriesModule } from "../countries";
import { Genre } from "../genres/models/genres.model";
import { GenresModule } from "../genres/genres.module";
import { Person, PersonsModule } from "../persons";
import { Profession } from "../professions/professions.model";
import { ProfessionsModule } from "../professions/professions.module";

import { FilmsController } from "./controllers";
import {
  Fact,
  Film,
  FilmCountry,
  FilmGenre,
  FilmPerson,
} from "./models";
import { FilmsService } from "./services";

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
  providers: [FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}