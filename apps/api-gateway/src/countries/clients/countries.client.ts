import { Injectable } from "@nestjs/common";

import { kinoDbRpc, RmqService } from "@common/services";
import { TCountriesListResponse } from "@common/types";

@Injectable()
export class CountriesClient {
  constructor(private readonly rmq: RmqService) {}

  getAllCountries(): Promise<TCountriesListResponse> {
    return this.rmq.sendToFilms(
      kinoDbRpc.countries.getAll, {}
    );
  }
}