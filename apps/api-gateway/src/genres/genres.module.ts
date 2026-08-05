import { Module } from "@nestjs/common";

import { GenresClient } from "./clients";
import { GenresController } from "./controllers";
import { GenresService } from "./services";

@Module({
  controllers: [GenresController],

  providers: [
    GenresService,
    GenresClient,
  ],

  exports: [
    GenresService,
    GenresClient,
  ],
})
export class GenresModule {}
