import type { TRoleOrmModel, TRoleCreationAtt } from "../orm";

import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

import { User } from "../../users/models/users.model";

import { UserRoles } from "./userRole.model";

@Table({ tableName: "roles" })
export class Role extends Model<TRoleOrmModel, TRoleCreationAtt> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value!: string;

  @BelongsToMany(() => User, () => UserRoles)
  users!: User[];
}
