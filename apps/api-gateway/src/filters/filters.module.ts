import { Module } from "@nestjs/common";

import { FiltersClient } from "./clients";
import { FiltersController } from "./controllers";
import { FiltersService } from "./services";

@Module({
  controllers: [FiltersController],
  providers: [
    FiltersService,
    FiltersClient,
  ],
  exports: [FiltersService],
})
export class FiltersModule {}
