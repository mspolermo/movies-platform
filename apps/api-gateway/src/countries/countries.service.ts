import type { TCountriesListResponse } from "@common/types";

import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { kinoDbRpc } from "@common/messaging";

@Injectable()
export class CountriesService {
  constructor(
    @Inject("FILMS_CLIENT") private readonly filmsClient: ClientProxy
  ) {}

  async getAllCountries(): Promise<TCountriesListResponse> {
    return await firstValueFrom(
      this.filmsClient.send(kinoDbRpc.countries.getAll, {})
    );
  }
}
