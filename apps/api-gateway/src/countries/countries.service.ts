import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { TCountryBased } from "@common/types";

@Injectable()
export class CountriesService {
  constructor(
    @Inject("FILMS_CLIENT") private readonly filmsClient: ClientProxy
  ) {}

  async getAllCountries(): Promise<TCountryBased[]> {
    return await firstValueFrom(this.filmsClient.send("getAll.countries", {}));
  }
}
