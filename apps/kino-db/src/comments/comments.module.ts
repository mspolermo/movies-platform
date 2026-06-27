import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Country } from "../countries";
import { FilmCountry, FilmGenre, FilmPerson, Fact, Film } from "../films";
import { Genre } from "../genres";
import { Person } from "../persons";
import { Profession } from "../professions";

import { CommentsController } from "./controllers";
import { Comment } from "./models";
import { CommentsService } from "./services/comments.service";

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
