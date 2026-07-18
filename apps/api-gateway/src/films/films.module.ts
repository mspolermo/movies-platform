import { Module } from "@nestjs/common";

import { JwtConfigModule } from "../jwt";

import { FilmsClient } from "./clients";
import { FilmsController } from "./controllers";
import { FilmsService } from "./services";

@Module({
  imports: [JwtConfigModule],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    FilmsClient,
  ],
  exports: [FilmsService],
})
export class FilmsModule {}