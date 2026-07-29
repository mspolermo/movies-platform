import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { Role } from "../models";

/** Чтение ролей; создание/редактирование не поддерживается — посев (ADR-007). */
@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  /** Роль по строковому значению (`ADMIN` / `USER` / `MANAGER`). */
  async getRoleByValue(value: string) {
    const role = await this.roleRepository.findOne({ where: { value } });
    return role;
  }
}
