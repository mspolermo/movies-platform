import { Module } from "@nestjs/common";

import { FiltersService } from "./application";
import { FiltersClient } from "./clients";
import { FiltersController } from "./controllers";

@Module({
  controllers: [FiltersController],
  providers: [
    FiltersService,
    FiltersClient,
  ],
  exports: [FiltersService],
})
export class FiltersModule {}
