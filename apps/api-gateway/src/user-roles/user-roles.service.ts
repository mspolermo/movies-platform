import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TUserBased } from "@common/types";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class UserRolesService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "User Roles Service", "auth-users");
  }

  async getUserWithRoles(userId: number): Promise<TUserBased> {
    try {
      return this.sendMessage("getUserById", userId);
    } catch (error) {
      console.error("❌ Ошибка получения ролей пользователя:", error);
      throw error;
    }
  }
}
