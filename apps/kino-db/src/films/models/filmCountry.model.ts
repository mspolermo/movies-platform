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
  timestamps: false,
})
export class FilmCountry extends Model<FilmCountry> {
  @ForeignKey(() => Country)
  @Column({
    field: "A",
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  countryId!: number;

  @ForeignKey(() => Film)
  @Column({
    field: "B",
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  filmId!: number;
}
