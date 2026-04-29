import type { TCountriesListResponse } from "@common/types";

import { Injectable } from "@nestjs/common";

import { RmqService, kinoDbRpc } from "@common/services";

@Injectable()
export class CountriesService {
  constructor(private readonly rmq: RmqService) {}

  async getAllCountries(): Promise<TCountriesListResponse> {
    return this.rmq.sendToFilms(
      kinoDbRpc.countries.getAll,
      {}
    );
  }
}