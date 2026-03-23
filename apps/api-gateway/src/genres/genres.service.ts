import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TGenreListResponse } from "@common/types";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class GenresService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Genres Service");
  }

  async getAllGenres(): Promise<TGenreListResponse> {
    return this.sendMessage("getAll.genres", "");
  }
}
