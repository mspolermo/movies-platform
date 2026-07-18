import { Module } from "@nestjs/common";

import { PersonsClient } from "./clients";
import { PersonsController } from "./controllers";
import { PersonsService } from "./services";

@Module({
  controllers: [PersonsController],
  providers: [PersonsService, PersonsClient],
  exports: [PersonsService],
})
export class PersonsModule {}
