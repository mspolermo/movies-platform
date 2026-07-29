import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { CommentLike } from "../comments/models/commentLike.model";
import { Comment } from "../comments/models/comments.model";
import { Country, CountriesModule } from "../countries";
import { Genre, GenresModule } from "../genres";
import { Person, PersonsModule } from "../persons";
import { Profession, ProfessionsModule } from "../professions";

import { FilmsAdminController, FilmsController } from "./controllers";
import {
  Fact,
  Film,
  FilmCountry,
  FilmGenre,
  FilmPerson,
} from "./models";
import {
  FilmCastService,
  FilmCatalogService,
  FilmDetailsService,
  FilmSimilarService,
  FilmsAdminService,
  FilmsService,
} from "./services";

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
      CommentLike,
    ]),
    PersonsModule,
    CountriesModule,
    GenresModule,
    ProfessionsModule,
  ],
  controllers: [FilmsController, FilmsAdminController],
  providers: [
    FilmDetailsService,
    FilmCatalogService,
    FilmSimilarService,
    FilmCastService,
    FilmsService,
    FilmsAdminService,
  ],
  exports: [FilmsService],
})
export class FilmsModule {}