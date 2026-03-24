import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Film } from "../films/films.model";
import { TFactCreationAtt, TFactOrmModel } from "@common/types";

@Table({ tableName: "Fact", timestamps: false })
export class Fact extends Model<TFactOrmModel, TFactCreationAtt> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  value!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  type!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  spoiler!: boolean;

  @ForeignKey(() => Film)
  @Column({ allowNull: false })
  filmId!: number;

  @BelongsTo(() => Film)
  film!: Film;
}
