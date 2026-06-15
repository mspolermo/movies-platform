import { Module } from "@nestjs/common";

import { JwtConfigModule } from "../jwt";

import { FilmsService } from "./services";
import { FilmsClient } from "./clients";
import { FilmsController } from "./controllers";

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