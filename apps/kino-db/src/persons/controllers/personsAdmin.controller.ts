import type {
  TAdminListRequest,
  TAdminPersonsListResponse,
  TAdminUpdatePersonRpcRequest,
  TCreatePersonRequest,
  TAdminPersonItemResponse,
} from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";

import { PersonsAdminService } from "../services";

@Controller("admin-persons")
export class PersonsAdminController {
  constructor(private readonly personsAdminService: PersonsAdminService) {}

  @MessagePattern(kinoDbRpc.admin.persons.list)
  listPersons(
    @Payload() request: TAdminListRequest
  ): Promise<TAdminPersonsListResponse> {
    return this.personsAdminService.listPersons(request);
  }

  @MessagePattern(kinoDbRpc.admin.persons.getById)
  getPersonById(@Payload() id: number): Promise<TAdminPersonItemResponse> {
    return this.personsAdminService.getPersonById(id);
  }

  @MessagePattern(kinoDbRpc.admin.persons.create)
  createPerson(
    @Payload() dto: TCreatePersonRequest
  ): Promise<TAdminPersonItemResponse> {
    return this.personsAdminService.createPerson(dto);
  }

  @MessagePattern(kinoDbRpc.admin.persons.update)
  updatePerson(
    @Payload() request: TAdminUpdatePersonRpcRequest
  ): Promise<TAdminPersonItemResponse> {
    return this.personsAdminService.updatePerson(request.id, request.data);
  }

  @MessagePattern(kinoDbRpc.admin.persons.delete)
  deletePerson(@Payload() id: number): Promise<true> {
    return this.personsAdminService.deletePerson(id);
  }
}
