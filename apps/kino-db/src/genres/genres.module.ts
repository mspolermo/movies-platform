import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { FilmGenre, Film } from "../films";

import { GenresAdminController, GenresController } from "./controllers";
import { Genre } from "./models";
import { GenresAdminService, GenresService } from "./services";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Genre,
      Film,
      FilmGenre,
    ])
  ],
  providers: [GenresService, GenresAdminService],
  controllers: [GenresController, GenresAdminController],
})
export class GenresModule {}
