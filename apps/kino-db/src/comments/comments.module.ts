import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Country } from "../countries";
import { FilmCountry, FilmGenre, FilmPerson, Fact, Film } from "../films";
import { Genre } from "../genres/models/genres.model";
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
