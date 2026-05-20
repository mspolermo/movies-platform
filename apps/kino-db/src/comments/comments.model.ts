import type { TCommentCreationAtt, TCommentOrmModel } from "@common/types/orm";

import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { Film } from "../films";

@Table({ tableName: "Comment", timestamps: false })
export class Comment extends Model<TCommentOrmModel, TCommentCreationAtt> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ApiProperty({ example: "Заголовок", description: "Заголовок комента" })
  @Column({ type: DataType.TEXT })
  header!: string;

  @ApiProperty({ example: "Текст", description: "Текст комента" })
  @Column({ type: DataType.TEXT, allowNull: false })
  value!: string;

  @ApiProperty({ example: "1", description: "id user который написал комент" })
  @Column({ type: DataType.INTEGER, allowNull: false })
  authorId!: number;

  @ApiProperty({
    example: "1",
    description: "id user комента к которому пишется коментт",
  })
  @Column({ type: DataType.INTEGER })
  parentId!: number;

  @ApiProperty({ description: "дата создания комента" })
  @Column({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- PG literal не в типах Sequelize
    type: "TIMESTAMP(3) WITHOUT TIME ZONE" as any,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  createdAt!: Date;

  @ApiProperty({ description: "никнейм юзера" })
  @Column({ type: DataType.TEXT, allowNull: false })
  nickName!: string;

  @ForeignKey(() => Film)
  @Column({ allowNull: false })
  filmId!: number;

  @BelongsTo(() => Film)
  film!: Film;
}
