import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { SearchResult } from "./interfaces";
import { RabbitMQConfig } from "../config";
import { TGenreBased, TPersonBased, TFilmBased } from "@common/types";

@Injectable()
export class SearchService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    this.clientData = RabbitMQConfig.createKinoDbClient(this.configService);
  }

  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(this.clientData, "Search Service");
  }

  async searchByName(name?: string): Promise<SearchResult> {
    const searchName = name || "";

    try {
      const [films, persons, genres] = await Promise.all([
        firstValueFrom<TFilmBased[]>(this.clientData.send("searchFilmsByName", searchName)),
        firstValueFrom<TPersonBased[]>(this.clientData.send("searchPersonsByName", searchName)),
        firstValueFrom<TGenreBased[]>(this.clientData.send("searchGenresByName", searchName)),
      ]);

      return { films, persons, genres };
    } catch (error) {
      console.error("❌ Ошибка при поиске:", error);
      throw error;
    }
  }
}
