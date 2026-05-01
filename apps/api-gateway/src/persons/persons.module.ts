import { Module } from "@nestjs/common";

import { PersonsService } from "./application";
import { PersonsClient } from "./clients";
import { PersonsController } from "./controllers";

@Module({
  controllers: [PersonsController],
  providers: [PersonsService, PersonsClient],
  exports: [PersonsService],
})
export class PersonsModule {}
