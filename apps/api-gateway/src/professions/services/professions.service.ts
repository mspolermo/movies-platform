import type {
  TGetPersonsByProfessionRequest,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { ProfessionsClient } from "../clients";

@Injectable()
export class ProfessionsService {
  constructor(
    private readonly professionsClient: ProfessionsClient
  ) {}

  getAllProfessions(): Promise<TProfessionItemResponse[]> {
    return this.professionsClient.getAllProfessions();
  }

  getPersonsByProfessionId(
    request: TGetPersonsByProfessionRequest
  ): Promise<TPaginatedPersonsResponse> {
    return this.professionsClient.getPersonsByProfessionId(
      request
    );
  }
}