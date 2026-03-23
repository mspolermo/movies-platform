import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TSearchResult } from "./interfaces";
import {
  TFilmCardResponse,
  TPersonListItemResponse,
} from "@common/types";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class SearchService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Search Service");
  }

  async searchByName(name?: string): Promise<TSearchResult> {
    const searchName = name || "";

    try {
      const [films, persons] = await Promise.all([
        this.sendMessage<TFilmCardResponse[]>("searchFilmsByName", searchName),
        this.sendMessage<TPersonListItemResponse[]>("searchPersonsByName", searchName),
      ]);

      return { films, persons };
    } catch (error) {
      console.error("❌ Ошибка при поиске:", error);
      throw error;
    }
  }
}
