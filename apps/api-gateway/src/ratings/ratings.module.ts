import { Module } from "@nestjs/common";

import { FilmsModule } from "../films";
import { JwtConfigModule } from "../jwt";

import { RatingsClient } from "./clients";
import { RatingsController } from "./controllers";
import { RatingsService } from "./services";

@Module({
  imports: [JwtConfigModule, FilmsModule],
  controllers: [RatingsController],
  providers: [RatingsClient, RatingsService],
})
export class RatingsModule {}
