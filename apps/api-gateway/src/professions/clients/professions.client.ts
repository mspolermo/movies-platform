import type {
  TGetPersonsByProfessionRequest,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import {
  kinoDbRpc,
  RmqService,
} from "@common/services";

@Injectable()
export class ProfessionsClient {
  constructor(
    private readonly rmq: RmqService
  ) {}

  getAllProfessions(): Promise<TProfessionItemResponse[]> {
    return this.rmq.sendToFilms(
      kinoDbRpc.professions.getAll,
      {}
    );
  }

  getPersonsByProfessionId(
    request: TGetPersonsByProfessionRequest
  ): Promise<TPaginatedPersonsResponse> {
    return this.rmq.sendToFilms(
      kinoDbRpc.persons.getByProfessionId,
      request
    );
  }
}