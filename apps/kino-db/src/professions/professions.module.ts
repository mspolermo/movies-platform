import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { PersonProfession } from "../persons/models";

import {
  ProfessionsAdminController,
  ProfessionsController,
} from "./controllers";
import { Profession } from "./models";
import { ProfessionsAdminService, ProfessionsService } from "./services";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Profession,
      PersonProfession,
    ]),
  ],
  controllers: [ProfessionsController, ProfessionsAdminController],
  providers: [ProfessionsService, ProfessionsAdminService],
  exports: [ProfessionsService],
})
export class ProfessionsModule {}
