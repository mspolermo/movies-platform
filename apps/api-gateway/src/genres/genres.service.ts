import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { RabbitMQConfig } from "../config";
import { GenreDto } from "@common/dto";
import { TGenreBased } from "@common/types";

@Injectable()
export class GenresService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    this.clientData = RabbitMQConfig.createKinoDbClient(this.configService);
  }

  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(this.clientData, "Genres Service");
  }

  async getAllGenres(): Promise<TGenreBased[]> {
    const genres = await firstValueFrom<TGenreBased[]>(
      this.clientData.send("getAll.genres", "")
    );
    return genres;
  }

  async updateGenre(id: number, dto: GenreDto): Promise<TGenreBased> {
    return await firstValueFrom(
      this.clientData.send("updateGenre", { id, dto })
    );
  }
}
