import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { Country } from "../../countries/models/countries.model";

import { Film } from "./films.model";

@Table({
  tableName: "_CountryToFilm",
  createdAt: false,
  updatedAt: false,
  indexes: [{ name: "_CountryToFilm_B_index", fields: ["B"] }],
})
export class FilmCountry extends Model<FilmCountry> {
  @ForeignKey(() => Country)
  @Column({ type: DataType.INTEGER, allowNull: false })
  A!: number;

  @ForeignKey(() => Film)
  @Column({ type: DataType.INTEGER, allowNull: false })
  B!: number;
}
