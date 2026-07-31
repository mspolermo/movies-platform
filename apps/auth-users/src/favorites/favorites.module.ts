import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { FavoritesController } from "./controllers";
import { UserFavorite } from "./models";
import { FavoritesService } from "./services";

@Module({
  imports: [SequelizeModule.forFeature([UserFavorite])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
