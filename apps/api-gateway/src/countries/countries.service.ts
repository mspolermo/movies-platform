import type { TCountriesListResponse } from "@common/types";

import { Injectable } from "@nestjs/common";

import { kinoDbRpc } from "@common/messaging";

import { RmqService } from "../shared/rmq/rmq.service";

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