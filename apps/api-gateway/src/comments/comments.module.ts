import { Module } from "@nestjs/common";

import { CommentsClient } from "./clients";
import { CommentsController } from "./controllers";
import { CommentsService } from "./services";

@Module({
  controllers: [CommentsController],
  providers: [CommentsClient, CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
