import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Profession, ProfessionsModule } from "../professions";

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
