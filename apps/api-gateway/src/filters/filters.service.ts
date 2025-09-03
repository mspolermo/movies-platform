import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { RabbitMQConfig } from "../config";
import { FiltersResult } from "./dto";
import { TCountryBased, TGenreBased } from "@common/types";

@Injectable()
export class FiltersService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    this.clientData = RabbitMQConfig.createKinoDbClient(this.configService);
  }

  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(this.clientData, "Filters Service");
  }

  async getFilters(): Promise<FiltersResult> {
    const [genres, countries, years] = await Promise.all([
      firstValueFrom<TGenreBased[]>(this.clientData.send("getAll.genres", "")),
      firstValueFrom<TCountryBased[]>(this.clientData.send("getAll.countries", "")),
      firstValueFrom(this.clientData.send("getAllFilmYears", "")),
    ]);

    return {
      genres,
      countries,
      years,
    };
  }
}
