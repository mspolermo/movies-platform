import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { FilmPerson } from "../films/models";
import { Profession, ProfessionsModule } from "../professions";

import { PersonsAdminController, PersonsController } from "./controllers";
import { Person, PersonProfession } from "./models";
import { PersonsAdminService, PersonsService } from "./services";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Person,
      Profession,
      PersonProfession,
      FilmPerson,
    ]),
    ProfessionsModule,
  ],
  controllers: [PersonsController, PersonsAdminController],
  providers: [PersonsService, PersonsAdminService],
  exports: [PersonsService],
})
export class PersonsModule {}
