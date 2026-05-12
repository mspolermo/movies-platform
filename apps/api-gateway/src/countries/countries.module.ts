import { Module } from "@nestjs/common";

import { CountriesService } from "./application";
import { CountriesController } from "./controllers";

@Module({
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
