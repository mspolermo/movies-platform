import { Module } from "@nestjs/common";

import { JwtConfigModule } from "../jwt";

import { CommentsController } from "./controllers";
import { CommentsService } from "./services";

@Module({
  imports: [JwtConfigModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
