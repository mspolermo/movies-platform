import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { ProfessionsController } from "./controllers";
import { Profession } from "./models";
import { ProfessionsService } from "./services";

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
