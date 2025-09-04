import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { RabbitMQConfig } from "../config";
import { UpdateFilmDTO } from "./dto";
import { FilmFilters } from "./interfaces";
import { TFilmBased } from "@common/types";

@Injectable()
export class FilmsService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    this.clientData = RabbitMQConfig.createKinoDbClient(this.configService);
  }

  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(this.clientData, "Films Service");
  }

  async getFilmById(id: number): Promise<TFilmBased> {
    return await firstValueFrom(this.clientData.send("getFilmById", id));
  }

  async updateFilm(id: number, dto: UpdateFilmDTO): Promise<TFilmBased> {
    return await firstValueFrom(
      this.clientData.send("updateFilm", { id, dto })
    );
  }

  async deleteFilmById(id: number): Promise<boolean> {
    return await firstValueFrom(this.clientData.send("deleteFilmById", id));
  }

  async searchFilms(filters: FilmFilters): Promise<TFilmBased[]> {
    return await firstValueFrom(this.clientData.send("filters", filters));
  }

  async checkConnection(): Promise<boolean> {
    try {
      // Проверяем соединение с RabbitMQ через ping
      await this.clientData.emit("ping", { timestamp: Date.now() });
      return true;
    } catch (error) {
      console.error("❌ Ошибка проверки соединения kino-db:", error);
      return false;
    }
  }

  isConnected(): boolean {
    try {
      // Проверяем состояние клиента RabbitMQ
      return this.clientData !== undefined;
    } catch (error) {
      return false;
    }
  }
}
