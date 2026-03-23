import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { TCountryListResponse } from "@common/types";

@Injectable()
export class CountriesService {
  constructor(
    @Inject("FILMS_CLIENT") private readonly filmsClient: ClientProxy
  ) {}

  async getAllCountries(): Promise<TCountryListResponse> {
    return await firstValueFrom(this.filmsClient.send("getAll.countries", {}));
  }
}
