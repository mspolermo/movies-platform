import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Film } from "../films/films.model";
import { TFactEntity, TFactModel } from "@common/types";

@Table({ tableName: "Fact", timestamps: false })
export class Fact extends Model<
  TFactModel,
  Pick<TFactEntity, "value" | "type" | "spoiler" | "filmId">
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.STRING, unique: true })
  value!: string;

  @Column({ type: DataType.STRING, unique: true })
  type!: string;

  @Column({ type: DataType.BOOLEAN, unique: true })
  spoiler!: boolean;

  @ForeignKey(() => Film)
  @Column
  filmId!: number;

  @BelongsTo(() => Film)
  film!: Film;
}
