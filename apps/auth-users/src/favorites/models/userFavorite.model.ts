import type {
  TUserFavoriteCreationAtt,
  TUserFavoriteOrmModel,
} from "@common/types/orm";

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { User } from "../../users/models/users.model";

/** Избранный фильм пользователя. */
@Table({
  tableName: "user_favorites",
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ["userId", "filmId"],
    },
    {
      name: "user_favorites_userId_createdAt_id_idx",
      fields: ["userId", "createdAt", "id"],
    },
  ],
})
export class UserFavorite extends Model<
  TUserFavoriteOrmModel,
  TUserFavoriteCreationAtt
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: "CASCADE",
  })
  userId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  filmId!: number;

  @BelongsTo(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  user!: User;
}
