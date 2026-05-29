import { Module } from "@nestjs/common";

import { JwtConfigModule } from "../jwt";

import { GenresClient } from "./clients";
import { GenresController } from "./controllers";
import { GenresService } from "./services";

@Module({
  imports: [JwtConfigModule],

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