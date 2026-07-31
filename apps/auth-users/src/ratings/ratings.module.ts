import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { RatingsController } from "./controllers";
import { UserFilmRating } from "./models";
import { RatingsService } from "./services";

@Module({
  imports: [SequelizeModule.forFeature([UserFilmRating])],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
