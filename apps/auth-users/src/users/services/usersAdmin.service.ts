import type {
  TAdminListRequest,
  TAdminUserItemResponse,
  TAdminUsersListResponse,
  TUpdateUserRoleRequest,
} from "@common/types";

import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";

import { toAdminListParams, toPaginatedItemsResponse } from "@common/utils";

import { Role } from "../../roles/models";
import { RolesService } from "../../roles/services";
import { toAdminUserItem } from "../mappers";
import { User } from "../models";

/** Admin-операции над пользователями: список и назначение роли (ADR-005/ADR-007). */
@Injectable()
export class UsersAdminService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(Role) private readonly roleRepository: typeof Role,
    private readonly rolesService: RolesService,
    private readonly sequelize: Sequelize
  ) {}

  /** Пагинированный список пользователей с ролями. */
  async listUsers(
    request: TAdminListRequest
  ): Promise<TAdminUsersListResponse> {
    const { page, perPage, offset } = toAdminListParams(request);

    const { rows, count } = await this.userRepository.findAndCountAll({
      include: [{ model: Role, through: { attributes: [] } }],
      order: [["id", "ASC"]],
      limit: perPage,
      offset,
      // BelongsToMany join задваивает count без distinct
      distinct: true,
    });

    return toPaginatedItemsResponse(
      rows.map(toAdminUserItem),
      count,
      page,
      perPage
    );
  }

  /**
   * Назначает пользователю единственную роль (`$set`).
   * Инвариант: нельзя снять роль ADMIN с последнего администратора → 409 (ADR-005).
   * Demote сериализуется через `FOR UPDATE` на строке роли ADMIN + пользователе.
   */
  async setUserRole(
    id: number,
    data: TUpdateUserRoleRequest
  ): Promise<TAdminUserItemResponse> {
    const role = await this.rolesService.getRoleByValue(data.role);
    if (!role) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Роль ${data.role} не существует`,
      });
    }

    return this.sequelize.transaction(async (transaction) => {
      const user = await this.userRepository.findOne({
        where: { id },
        include: [{ model: Role, through: { attributes: [] } }],
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!user) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: "Пользователь не найден",
        });
      }

      const isAdminNow = (user.roles ?? []).some(
        (userRole) => userRole.value === "ADMIN"
      );

      if (isAdminNow && data.role !== "ADMIN") {
        // Блокируем строку роли ADMIN — параллельные demote не проскочат оба
        await this.roleRepository.findOne({
          where: { value: "ADMIN" },
          lock: transaction.LOCK.UPDATE,
          transaction,
        });

        const adminsCount = await this.userRepository.count({
          include: [
            {
              model: Role,
              where: { value: "ADMIN" },
              through: { attributes: [] },
            },
          ],
          distinct: true,
          transaction,
        });

        if (adminsCount <= 1) {
          throw new RpcException({
            statusCode: HttpStatus.CONFLICT,
            message: "Нельзя снять роль ADMIN с последнего администратора",
          });
        }
      }

      await user.$set("roles", [role.id], { transaction });

      // Перечитываем с ролями — $set не обновляет загруженную связь
      const updated = await this.userRepository.findOne({
        where: { id },
        include: [{ model: Role, through: { attributes: [] } }],
        transaction,
      });

      return toAdminUserItem(updated!);
    });
  }
}
