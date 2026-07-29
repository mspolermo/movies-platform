import type {
  TAdminCountriesListResponse,
  TAdminListRequest,
  TCountryAdminItemResponse,
  TCreateCountryRequest,
  TUpdateCountryRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { throwHttpFromRpcError } from "../../shared";
import { AdminKinoDbClient } from "../clients";

/** Admin CRUD стран: делегирует в kino-db, RPC-ошибки → HttpException. */
@Injectable()
export class AdminCountriesService {
  constructor(private readonly client: AdminKinoDbClient) {}

  async listCountries(
    request: TAdminListRequest
  ): Promise<TAdminCountriesListResponse> {
    try {
      return await this.client.listCountries(request);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async createCountry(
    dto: TCreateCountryRequest
  ): Promise<TCountryAdminItemResponse> {
    try {
      return await this.client.createCountry(dto);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async updateCountry(
    id: number,
    data: TUpdateCountryRequest
  ): Promise<TCountryAdminItemResponse> {
    try {
      return await this.client.updateCountry(id, data);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }

  async deleteCountry(id: number): Promise<true> {
    try {
      return await this.client.deleteCountry(id);
    } catch (error) {
      throwHttpFromRpcError(error);
    }
  }
}
