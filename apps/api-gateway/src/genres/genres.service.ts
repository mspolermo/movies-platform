import type { TGenresListResponse } from "@common/types";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { kinoDbRpc } from "@common/messaging";

import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class GenresService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Genres Service");
  }

  async getAllGenres(): Promise<TGenresListResponse> {
    return this.sendMessage(kinoDbRpc.genres.getAll, "");
  }
}
