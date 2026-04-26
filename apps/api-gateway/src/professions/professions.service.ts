import type {
  TGetPersonsByProfessionRequest,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from '@common/types';

import { Injectable } from '@nestjs/common';

import { kinoDbRpc } from '@common/messaging';

import { RmqService } from '../shared/rmq/rmq.service';

@Injectable()
export class ProfessionsService {
  constructor(private readonly rmq: RmqService) {}

  async getAllProfessions(): Promise<TProfessionItemResponse[]> {
    return this.rmq.sendToFilms<TProfessionItemResponse[]>(
      kinoDbRpc.professions.getAll,
      {}
    );
  }

  async getPersonsByProfessionId(
    request: TGetPersonsByProfessionRequest
  ): Promise<TPaginatedPersonsResponse> {
    return this.rmq.sendToFilms<TPaginatedPersonsResponse>(
      kinoDbRpc.persons.getByProfessionId,
      request
    );
  }
}
