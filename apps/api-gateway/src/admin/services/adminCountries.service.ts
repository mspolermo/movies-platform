import type {
  TAdminCountriesListResponse,
  TAdminListRequest,
  TAdminCountryItemResponse,
  TCreateCountryRequest,
  TUpdateCountryRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { fromRpc } from "../../shared";
import { AdminKinoDbClient } from "../clients";

/** Admin CRUD стран (kino-db RPC). */
@Injectable()
export class AdminCountriesService {
  constructor(private readonly client: AdminKinoDbClient) {}

  listCountries(
    request: TAdminListRequest
  ): Promise<TAdminCountriesListResponse> {
    return fromRpc(this.client.listCountries(request));
  }

  createCountry(
    dto: TCreateCountryRequest
  ): Promise<TAdminCountryItemResponse> {
    return fromRpc(this.client.createCountry(dto));
  }

  updateCountry(
    id: number,
    data: TUpdateCountryRequest
  ): Promise<TAdminCountryItemResponse> {
    return fromRpc(this.client.updateCountry(id, data));
  }

  deleteCountry(id: number): Promise<true> {
    return fromRpc(this.client.deleteCountry(id));
  }
}
