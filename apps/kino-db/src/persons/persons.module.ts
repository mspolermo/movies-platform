import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Profession } from "../professions/models/professions.model";
import { ProfessionsModule } from "../professions/professions.module";

import { PersonsController } from "./controllers";
import { Person, PersonProfession } from "./models";
import { PersonsService } from "./services";

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
