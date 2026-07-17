import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { Genre } from "../../genres/models/genres.model";

import { Film } from "./films.model";

@Table({
  tableName: "_FilmToGenre",
  timestamps: false,
})
export class FilmGenre extends Model<FilmGenre> {
  @ForeignKey(() => Film)
  @Column({
    field: "A",
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  filmId!: number;

  @ForeignKey(() => Genre)
  @Column({
    field: "B",
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  genreId!: number;

  /** as: "Film" — совпадает с Sequelize.col("Film.ratingKp") в getSimilarFilms. */
  @BelongsTo(() => Film, { as: "Film", foreignKey: "filmId" })
  film!: Film;
}