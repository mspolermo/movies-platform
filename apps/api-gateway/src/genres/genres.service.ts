import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GenreDto } from "@common/dto";
import { TGenreBased } from "@common/types";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class GenresService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Genres Service");
  }

  async getAllGenres(): Promise<TGenreBased[]> {
    return this.sendMessage("getAll.genres", "");
  }

  async updateGenre(id: number, dto: GenreDto): Promise<TGenreBased> {
    return this.sendMessage("updateGenre", { id, dto });
  }
}
