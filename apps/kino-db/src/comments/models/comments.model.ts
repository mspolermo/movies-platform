import type { TCommentCreationAtt, TCommentOrmModel } from "../orm";

import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";

import { Film } from "../../films/models/films.model";

import { CommentLike } from "./commentLike.model";

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
  title!: string;

  @ApiProperty({ example: "Текст", description: "Текст комента" })
  @Column({ type: DataType.TEXT, allowNull: false })
  text!: string;

  @ApiProperty({ example: "1", description: "id user который написал комент" })
  @Column({ type: DataType.INTEGER, allowNull: false })
  authorId!: number;

  @ApiProperty({ description: "дата создания комента" })
  @Column({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- PG literal не в типах Sequelize
    type: "TIMESTAMP(3) WITHOUT TIME ZONE" as any,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  createdAt!: Date;

  @ApiProperty({ description: "имя автора" })
  @Column({ type: DataType.TEXT, allowNull: false })
  authorName!: string;

  @ForeignKey(() => Film)
  @Column({ allowNull: false })
  filmId!: number;

  @BelongsTo(() => Film)
  film!: Film;

  @HasMany(() => CommentLike)
  likes!: CommentLike[];
}
