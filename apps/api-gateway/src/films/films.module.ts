import { Module } from "@nestjs/common";

import { FilmsClient } from "./clients";
import { FilmsController } from "./controllers";
import { FilmsService } from "./services";

@Module({
  controllers: [FilmsController],
  providers: [FilmsService, FilmsClient],
  exports: [FilmsService],
})
export class FilmsModule {}
