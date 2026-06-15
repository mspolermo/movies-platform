import { Module } from "@nestjs/common";

import { CountriesService } from "./services";
import { CountriesClient } from "./clients";
import { CountriesController } from "./controllers";

@Module({
  controllers: [CountriesController],
  providers: [
    CountriesService,
    CountriesClient,
  ],
})
export class CountriesModule {}
