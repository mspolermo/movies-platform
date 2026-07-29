import type {
  TAdminCountriesListResponse,
  TAdminListRequest,
  TAdminUpdateCountryRpcRequest,
  TCountryAdminItemResponse,
  TCreateCountryRequest,
} from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";

import { CountriesAdminService } from "../services";

/** RPC-хендлеры admin CRUD стран; авторизация — на gateway (ADR-005). */
@Controller("admin-countries")
export class CountriesAdminController {
  constructor(private readonly countriesAdminService: CountriesAdminService) {}

  @MessagePattern(kinoDbRpc.admin.countries.list)
  listCountries(
    @Payload() request: TAdminListRequest
  ): Promise<TAdminCountriesListResponse> {
    return this.countriesAdminService.listCountries(request);
  }

  @MessagePattern(kinoDbRpc.admin.countries.create)
  createCountry(
    @Payload() dto: TCreateCountryRequest
  ): Promise<TCountryAdminItemResponse> {
    return this.countriesAdminService.createCountry(dto);
  }

  @MessagePattern(kinoDbRpc.admin.countries.update)
  updateCountry(
    @Payload() request: TAdminUpdateCountryRpcRequest
  ): Promise<TCountryAdminItemResponse> {
    return this.countriesAdminService.updateCountry(request.id, request.data);
  }

  @MessagePattern(kinoDbRpc.admin.countries.delete)
  deleteCountry(@Payload() id: number): Promise<true> {
    return this.countriesAdminService.deleteCountry(id);
  }
}
