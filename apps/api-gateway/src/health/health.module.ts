import { Module } from "@nestjs/common";

import { AuthModule } from "../auth";
import { FilmsModule } from "../films";

import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

@Module({
  imports: [AuthModule, FilmsModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
