import { Module } from "@nestjs/common";

import { SearchClient } from "./clients";
import { SearchController } from "./controllers";
import { SearchService } from "./services";

@Module({
  controllers: [SearchController],
  providers: [SearchService, SearchClient],
  exports: [SearchService],
})
export class SearchModule {}
