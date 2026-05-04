import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { Person } from "../persons";

import { Film } from "./films.model";

@Table({
  tableName: "_FilmToPerson",
  createdAt: false,
  updatedAt: false,
  indexes: [{ name: "_FilmToPerson_B_index", fields: ["B"] }],
})
export class FilmPerson extends Model<FilmPerson> {
  @ForeignKey(() => Film)
  @Column({ type: DataType.INTEGER, allowNull: false })
  A!: number;

  @ForeignKey(() => Person)
  @Column({ type: DataType.INTEGER, allowNull: false })
  B!: number;
}
