import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { FilmGenre, Film } from "../films";

import { GenresController } from "./controllers";
import { Genre } from "./models/genres.model";
import { GenresService } from "./services";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Genre,
      Film,
      FilmGenre,
    ])
  ],
  providers: [GenresService],
  controllers: [GenresController],
})
export class GenresModule {}
