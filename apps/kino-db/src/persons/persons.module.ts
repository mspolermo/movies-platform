import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PersonsController } from "./persons.controller";
import { PersonProfession } from "./personProfession";
import { ProfessionsModule } from "../professions/professions.module";
import { PersonsService } from "./persons.service";
import { Person } from "./persons.model";
import { Profession } from "../professions/professions.model";

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
