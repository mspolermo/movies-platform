import { ProfessionsController } from "./professions.controller";
import { ProfessionsService } from "./professions.service";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Profession } from "./professions.model";

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
