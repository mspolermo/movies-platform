import type { TUserEntity } from "@common/types/entity";

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { User } from "../users/users.model";

type TRefreshTokenEntity = {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedByHash: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

type TRefreshTokenCreationAtt = Pick<
  TRefreshTokenEntity,
  "userId" | "tokenHash" | "expiresAt"
>;

@Table({ tableName: "refresh_tokens" })
export class RefreshToken extends Model<
  TRefreshTokenEntity,
  TRefreshTokenCreationAtt
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({ type: DataType.STRING(64), allowNull: false, unique: true })
  tokenHash!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expiresAt!: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  revokedAt!: Date | null;

  @Column({ type: DataType.STRING(64), allowNull: true })
  replacedByHash!: string | null;
}
