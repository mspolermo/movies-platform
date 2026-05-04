import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Country } from "../countries/countries.model";
import { Fact } from "../facts/facts.model";
import { FilmCountry } from "../films/filmCountry";
import { FilmGenre } from "../films/filmGenre";
import { FilmPerson } from "../films/filmPerson";
import { Film } from "../films/films.model";
import { Genre } from "../genres/genres.model";
import { Person } from "../persons";
import { Profession } from "../professions/professions.model";

import { CommentsController } from "./comments.controller";
import { Comment } from "./comments.model";
import { CommentsService } from "./comments.service";

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
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
