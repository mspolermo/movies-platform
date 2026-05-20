import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { Genre } from "../../genres/genres.model";

import { Film } from "./films.model";

@Table({
  tableName: "_FilmToGenre",
  createdAt: false,
  updatedAt: false,
  indexes: [{ name: "_FilmToGenre_B_index", fields: ["B"] }],
})
export class FilmGenre extends Model<FilmGenre> {
  @ForeignKey(() => Film)
  @Column({ type: DataType.INTEGER, allowNull: false })
  A!: number;

  @ForeignKey(() => Genre)
  @Column({ type: DataType.INTEGER, allowNull: false })
  B!: number;
}
