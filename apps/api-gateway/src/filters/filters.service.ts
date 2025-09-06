import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FiltersResult } from "./dto";
import { TCountryBased, TGenreBased } from "@common/types";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class FiltersService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Filters Service");
  }

  async getFilters(): Promise<FiltersResult> {
    const [genres, countries, years] = await Promise.all([
      this.sendMessage<TGenreBased[]>("getAll.genres", ""),
      this.sendMessage<TCountryBased[]>("getAll.countries", ""),
      this.sendMessage<number[]>("getAllFilmYears", ""),
    ]);

    return {
      genres,
      countries,
      years,
    };
  }
}
