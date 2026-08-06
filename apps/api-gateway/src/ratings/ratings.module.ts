import { Module } from "@nestjs/common";

import { FilmsModule } from "../films";

import { RatingsClient } from "./clients";
import { RatingsController } from "./controllers";
import { RatingsService } from "./services";

@Module({
  imports: [FilmsModule],
  controllers: [RatingsController],
  providers: [RatingsClient, RatingsService],
})
export class RatingsModule {}
