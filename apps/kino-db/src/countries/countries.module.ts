import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { CountriesController } from "./controllers";
import { Country } from "./models";
import { CountriesService } from "./services"

@Module({
  imports: [
    SequelizeModule.forFeature([Country]),
  ],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}