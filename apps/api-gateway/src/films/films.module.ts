import { Module } from "@nestjs/common";

import { JwtConfigModule } from "../jwt";

import { FilmsController } from "./films.controller";
import { FilmsService } from "./films.service";

@Module({
  imports: [JwtConfigModule],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}
