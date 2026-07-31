import { Module } from "@nestjs/common";

import { FilmsModule } from "../films";
import { JwtConfigModule } from "../jwt";

import { FavoritesClient } from "./clients";
import { FavoritesController } from "./controllers";
import { FavoritesService } from "./services";

@Module({
  imports: [JwtConfigModule, FilmsModule],
  controllers: [FavoritesController],
  providers: [FavoritesClient, FavoritesService],
})
export class FavoritesModule {}
