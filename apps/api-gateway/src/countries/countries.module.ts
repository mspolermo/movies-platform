import { Module } from "@nestjs/common";

import { CountriesClient } from "./clients";
import { CountriesController } from "./controllers";
import { CountriesService } from "./services";

@Module({
  controllers: [CountriesController],
  providers: [
    CountriesService,
    CountriesClient,
  ],
})
export class CountriesModule {}
