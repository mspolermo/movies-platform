import type {
  TSearchResultResponse,
  TFilmListItemResponse,
  TPersonListItemResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { kinoDbRpc } from "@common/messaging";

import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class SearchService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Search Service");
  }

  async searchByName(name?: string): Promise<TSearchResultResponse> {
    const searchName = name || "";

    try {
      const [films, persons] = await Promise.all([
        this.sendMessage<TFilmListItemResponse[]>(
          kinoDbRpc.films.searchFilmsByName,
          searchName
        ),
        this.sendMessage<TPersonListItemResponse[]>(
          kinoDbRpc.persons.searchByName,
          searchName
        ),
      ]);

      return { films, persons };
    } catch (error) {
      console.error("❌ Ошибка при поиске:", error);
      throw error;
    }
  }
}
