import type {
  TAdminListRequest,
  TAdminPersonsListResponse,
  TCreatePersonRequest,
  TAdminPersonItemResponse,
  TUpdatePersonRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { fromRpc } from "../../shared";
import { AdminKinoDbClient } from "../clients";

/** Admin CRUD персон (kino-db RPC). */
@Injectable()
export class AdminPersonsService {
  constructor(private readonly client: AdminKinoDbClient) {}

  listPersons(request: TAdminListRequest): Promise<TAdminPersonsListResponse> {
    return fromRpc(this.client.listPersons(request));
  }

  getPersonById(id: number): Promise<TAdminPersonItemResponse> {
    return fromRpc(this.client.getPersonById(id));
  }

  createPerson(dto: TCreatePersonRequest): Promise<TAdminPersonItemResponse> {
    return fromRpc(this.client.createPerson(dto));
  }

  updatePerson(
    id: number,
    data: TUpdatePersonRequest
  ): Promise<TAdminPersonItemResponse> {
    return fromRpc(this.client.updatePerson(id, data));
  }

  deletePerson(id: number): Promise<true> {
    return fromRpc(this.client.deletePerson(id));
  }
}
