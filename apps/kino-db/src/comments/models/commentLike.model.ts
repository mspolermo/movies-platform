import type { TCommentLikeCreationAtt, TCommentLikeOrmModel } from "@common/types/orm";

import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { Comment } from "./comments.model";

@Table({
  tableName: "CommentLike",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ["commentId", "userId"],
    },
  ],
})
export class CommentLike extends Model<TCommentLikeOrmModel, TCommentLikeCreationAtt> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Comment)
  @Column({ type: DataType.INTEGER, allowNull: false })
  commentId!: number;

  @ApiProperty({ example: "1", description: "id пользователя, поставившего лайк" })
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @ApiProperty({ description: "дата лайка" })
  @Column({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- PG literal не в типах Sequelize
    type: "TIMESTAMP(3) WITHOUT TIME ZONE" as any,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  createdAt!: Date;

  @BelongsTo(() => Comment)
  comment!: Comment;
}
