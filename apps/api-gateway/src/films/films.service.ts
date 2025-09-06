import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FilmFilters } from "./interfaces";
import { UpdateFilmDto } from "@common/dto";
import { TFilmBased } from "@common/types";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class FilmsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Films Service");
  }

  async getFilmById(id: number): Promise<TFilmBased> {
    return this.sendMessage("getFilmById", id);
  }

  async updateFilm(id: number, dto: UpdateFilmDto): Promise<TFilmBased> {
    return this.sendMessage("updateFilm", { id, dto });
  }

  async deleteFilmById(id: number): Promise<boolean> {
    return this.sendMessage("deleteFilmById", id);
  }

  async searchFilms(filters: FilmFilters): Promise<TFilmBased[]> {
    return this.sendMessage("filters", filters);
  }
}
