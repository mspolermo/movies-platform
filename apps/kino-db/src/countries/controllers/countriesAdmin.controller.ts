import type {
  TAdminCountriesListResponse,
  TAdminListRequest,
  TAdminUpdateCountryRpcRequest,
  TAdminCountryItemResponse,
  TCreateCountryRequest,
} from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";

import { CountriesAdminService } from "../services";

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
  ): Promise<TAdminCountryItemResponse> {
    return this.countriesAdminService.createCountry(dto);
  }

  @MessagePattern(kinoDbRpc.admin.countries.update)
  updateCountry(
    @Payload() request: TAdminUpdateCountryRpcRequest
  ): Promise<TAdminCountryItemResponse> {
    return this.countriesAdminService.updateCountry(request.id, request.data);
  }

  @MessagePattern(kinoDbRpc.admin.countries.delete)
  deleteCountry(@Payload() id: number): Promise<true> {
    return this.countriesAdminService.deleteCountry(id);
  }
}
