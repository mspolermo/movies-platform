import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { ProfessionsController } from "./controllers/professions.controller";
import { Profession } from "./models/professions.model";
import { ProfessionsService } from "./services/professions.service";

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
