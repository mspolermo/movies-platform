import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TGetPersonsByProfessionRequest,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from '@common/types';
import { BaseMicroserviceService } from '../shared/services';

@Injectable()
export class ProfessionsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, 'Professions Service');
  }

  async getAllProfessions(): Promise<TProfessionItemResponse[]> {
    return this.sendMessage<TProfessionItemResponse[]>('getAll.professions', {});
  }

  async getPersonsByProfessionId(
    request: TGetPersonsByProfessionRequest
  ): Promise<TPaginatedPersonsResponse> {
    return this.sendMessage<TPaginatedPersonsResponse>('getPersonsByProfessionId', request);
  }
}
