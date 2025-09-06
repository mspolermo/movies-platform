import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SearchResult } from "./interfaces";
import { TGenreBased, TPersonBased, TFilmBased } from "@common/types";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class SearchService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Search Service");
  }

  async searchByName(name?: string): Promise<SearchResult> {
    const searchName = name || "";

    try {
      const [films, persons, genres] = await Promise.all([
        this.sendMessage<TFilmBased[]>("searchFilmsByName", searchName),
        this.sendMessage<TPersonBased[]>("searchPersonsByName", searchName),
        this.sendMessage<TGenreBased[]>("searchGenresByName", searchName),
      ]);

      return { films, persons, genres };
    } catch (error) {
      console.error("❌ Ошибка при поиске:", error);
      throw error;
    }
  }
}
