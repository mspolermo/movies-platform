import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { RabbitMQConfig } from "../config";
import { GenreDTO } from "./dto";
import { Genre } from "@common/types";

@Injectable()
export class GenresService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    this.clientData = RabbitMQConfig.createKinoDbClient(this.configService);
  }

  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(this.clientData, "Genres Service");
  }

  async getAllGenres(): Promise<Genre[]> {
    const genres = await firstValueFrom(
      this.clientData.send("getAll.genres", "")
    );
    return genres.map(this.transformGenreForListDto);
  }

  async updateGenre(id: number, dto: GenreDTO): Promise<Genre> {
    return await firstValueFrom(
      this.clientData.send("updateGenre", { id, dto })
    );
  }

  private transformGenreForListDto(genre: Genre): Genre {
    return { id: genre.id, nameRu: genre.nameRu, nameEn: genre.nameEn };
  }
}
