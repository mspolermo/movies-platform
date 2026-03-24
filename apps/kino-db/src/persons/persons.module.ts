import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Profession } from "../professions/professions.model";
import { ProfessionsModule } from "../professions/professions.module";

import { PersonProfession } from "./personProfession";
import { PersonsController } from "./persons.controller";
import { Person } from "./persons.model";
import { PersonsService } from "./persons.service";


@Module({
  imports: [
    SequelizeModule.forFeature([
      Person,
      Profession,
      PersonProfession,
    ]),
    ProfessionsModule,
  ],
  controllers: [PersonsController],
  providers: [PersonsService],
  exports: [PersonsService],
})
export class PersonsModule {}
