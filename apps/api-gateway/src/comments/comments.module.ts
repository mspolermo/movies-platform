import { Module } from "@nestjs/common";

import { JwtConfigModule } from "../jwt";

import { CommentsClient } from "./clients";
import { CommentsController } from "./controllers";
import { CommentsService } from "./services";

@Module({
  imports: [JwtConfigModule],
  controllers: [CommentsController],
  providers: [CommentsClient, CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
