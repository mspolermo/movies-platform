import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { FilmCountry } from "../films/models";

import { CountriesAdminController, CountriesController } from "./controllers";
import { Country } from "./models";
import { CountriesAdminService, CountriesService } from "./services"

@Module({
  imports: [
    SequelizeModule.forFeature([Country, FilmCountry]),
  ],
  controllers: [CountriesController, CountriesAdminController],
  providers: [CountriesService, CountriesAdminService],
})
export class CountriesModule {}