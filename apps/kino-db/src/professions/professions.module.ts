import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { ProfessionsController } from "./professions.controller";
import { Profession } from "./professions.model";
import { ProfessionsService } from "./professions.service";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Profession,
    ]),
  ],
  controllers: [ProfessionsController],
  providers: [ProfessionsService],
  exports: [ProfessionsService],
})
export class ProfessionsModule {}
