import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { FilmDto } from "./dto";
import { SearchResult } from "./interfaces";
import { RabbitMQConfig } from "../config";
import { Film } from "../shared/interfaces";
import { Genre, Person } from "@common/types";

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
        firstValueFrom(this.clientData.send("searchFilmsByName", searchName)),
        firstValueFrom<Person[]>(this.clientData.send("searchPersonsByName", searchName)),
        firstValueFrom<Genre[]>(this.clientData.send("searchGenresByName", searchName)),
      ]);

      return {
        films: films?.map(this.transformFilmDto) || [],
        persons: persons || [],
        genres: genres || [],
      };
    } catch (error) {
      console.error("❌ Ошибка при поиске:", error);
      throw error;
    }
  }

  private transformFilmDto(film: Film): FilmDto {
    return { id: film.id, nameRu: film.filmNameRu, nameEn: film.filmNameEn };
  }
}
