import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { User } from "../../users/models/users.model";

import {
  TUserRoleCreationAtt,
  TUserRoleOrmModel,
} from "./orm";
import { Role } from "./roles.model";

@Table({
  tableName: "user_roles",
  createdAt: false,
  updatedAt: false,
})
export class UserRoles extends Model<
  TUserRoleOrmModel,
  TUserRoleCreationAtt
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  roleId!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId!: number;
}