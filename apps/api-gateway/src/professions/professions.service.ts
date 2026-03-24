import type {
  TGetPersonsByProfessionRequest,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from '@common/types';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { kinoDbRpc } from '@common/messaging';

import { BaseMicroserviceService } from '../shared/services';

@Injectable()
export class ProfessionsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, 'Professions Service');
  }

  async getAllProfessions(): Promise<TProfessionItemResponse[]> {
    return this.sendMessage<TProfessionItemResponse[]>(
      kinoDbRpc.professions.getAll,
      {}
    );
  }

  async getPersonsByProfessionId(
    request: TGetPersonsByProfessionRequest
  ): Promise<TPaginatedPersonsResponse> {
    return this.sendMessage<TPaginatedPersonsResponse>(
      kinoDbRpc.persons.getByProfessionId,
      request
    );
  }
}
