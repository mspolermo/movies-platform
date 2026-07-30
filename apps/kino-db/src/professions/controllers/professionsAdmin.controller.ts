import type {
  TAdminListRequest,
  TAdminProfessionsListResponse,
  TAdminUpdateProfessionRpcRequest,
  TCreateProfessionRequest,
  TAdminProfessionItemResponse,
} from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";

import { ProfessionsAdminService } from "../services";

@Controller("admin-professions")
export class ProfessionsAdminController {
  constructor(
    private readonly professionsAdminService: ProfessionsAdminService
  ) {}

  @MessagePattern(kinoDbRpc.admin.professions.list)
  listProfessions(
    @Payload() request: TAdminListRequest
  ): Promise<TAdminProfessionsListResponse> {
    return this.professionsAdminService.listProfessions(request);
  }

  @MessagePattern(kinoDbRpc.admin.professions.create)
  createProfession(
    @Payload() dto: TCreateProfessionRequest
  ): Promise<TAdminProfessionItemResponse> {
    return this.professionsAdminService.createProfession(dto);
  }

  @MessagePattern(kinoDbRpc.admin.professions.update)
  updateProfession(
    @Payload() request: TAdminUpdateProfessionRpcRequest
  ): Promise<TAdminProfessionItemResponse> {
    return this.professionsAdminService.updateProfession(
      request.id,
      request.data
    );
  }

  @MessagePattern(kinoDbRpc.admin.professions.delete)
  deleteProfession(@Payload() id: number): Promise<true> {
    return this.professionsAdminService.deleteProfession(id);
  }
}
