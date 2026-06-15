import { Module } from "@nestjs/common";

import { FiltersService } from "./services";
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
