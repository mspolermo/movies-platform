import { Module } from "@nestjs/common";

import { SearchClient } from "./clients";
import { SearchController } from "./controllers/search.controller";
import { SearchService } from "./services/search.service";

@Module({
  controllers: [SearchController],
  providers: [SearchService, SearchClient],
  exports: [SearchService],
})
export class SearchModule {}
