import { Module } from "@nestjs/common";

import { JwtConfigModule } from "../jwt";

import { GenresController } from "./genres.controller";
import { GenresService } from "./genres.service";

@Module({
  imports: [JwtConfigModule],
  controllers: [GenresController],
  providers: [GenresService],
  exports: [GenresService],
})
export class GenresModule {}
