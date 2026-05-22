import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { Person } from "../../persons/models/persons.model";

import { Film } from "./films.model";

@Table({
  tableName: "_FilmToPerson",
  timestamps: false,
})
export class FilmPerson extends Model<FilmPerson> {
  @ForeignKey(() => Film)
  @Column({
    field: "A",
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  filmId!: number;

  @ForeignKey(() => Person)
  @Column({
    field: "B",
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  personId!: number;
}
