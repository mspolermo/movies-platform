import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TProfessionBased, PaginatedPersonsResponse } from '@common/types';
import { BaseMicroserviceService } from '../shared/services';

@Injectable()
export class ProfessionsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, 'Professions Service');
  }

  async getAllProfessions(): Promise<TProfessionBased[]> {
    return this.sendMessage<TProfessionBased[]>('getAll.professions', {});
  }

  async getPersonsByProfessionId(
    professionId: number,
    page?: number,
    limit?: number
  ): Promise<PaginatedPersonsResponse> {
    return this.sendMessage<PaginatedPersonsResponse>('getPersonsByProfessionId', {
      professionId,
      page,
      limit,
    });
  }
}
