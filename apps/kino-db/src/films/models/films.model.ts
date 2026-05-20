import type { TFilmOrmModel, TFilmCreationAtt } from "@common/types/orm";

import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";

import { Comment } from "../../comments/comments.model";
import { Country } from "../../countries";
import { Genre } from "../../genres/genres.model";
import { Person } from "../../persons";

import { Fact } from "./facts.model";
import { FilmCountry } from "./filmCountry.model";
import { FilmGenre } from "./filmGenre.model";
import { FilmPerson } from "./filmPerson.model";


@Table({ tableName: "Film", timestamps: false })
export class Film extends Model<TFilmOrmModel, TFilmCreationAtt>{
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ApiProperty({ example: "имя", description: "Имя трейлера" })
  @Column({ type: DataType.TEXT })
  trailerName!: string;

  @ApiProperty({ example: "url", description: "url трейлера" })
  @Column({ type: DataType.TEXT })
  trailerUrl!: string;

  @ApiProperty({ example: "8.4", description: "рейтинг кинопоиска" })
  @Column({ type: DataType.DOUBLE })
  ratingKp!: number;

  @ApiProperty({ example: "110", description: "кол-во голосов" })
  @Column({ type: DataType.INTEGER })
  votesKp!: number;

  @ApiProperty({ example: "8.4", description: "рейтинг imdb" })
  @Column({ type: DataType.DOUBLE })
  ratingImdb!: number;

  @ApiProperty({ example: "110", description: "кол-во голосов" })
  @Column({ type: DataType.INTEGER })
  votesImdb!: number;

  @ApiProperty({ example: "5", description: "рейтинг критиков" })
  @Column({ type: DataType.DOUBLE })
  ratingFilmCritics!: number;

  @ApiProperty({ example: "110", description: "кол-во голосов критиков" })
  @Column({ type: DataType.INTEGER })
  votesFilmCritics!: number;

  @ApiProperty({ example: "5", description: "рейтинг критиков" })
  @Column({ type: DataType.DOUBLE })
  ratingRussianFilmCritics!: number;

  @ApiProperty({ example: "110", description: "кол-во голосов критиков" })
  @Column({ type: DataType.INTEGER })
  votesRussianFilmCritics!: number;

  @ApiProperty({ example: "110", description: "длительнотсь фильма" })
  @Column({ type: DataType.INTEGER })
  movieLength!: number;

  @ApiProperty({ example: "eng", description: "язык оригинала фильма" })
  @Column({ type: DataType.TEXT })
  originalFilmLanguage!: string;

  @ApiProperty({ example: "имя", description: "Имя фильма русское" })
  @Column({ type: DataType.TEXT, allowNull: false })
  filmNameRu!: string;

  @ApiProperty({ example: "name", description: "Имя фильма английское" })
  @Column({ type: DataType.TEXT })
  filmNameEn!: string;

  @ApiProperty({ example: "описание", description: "описание фильма" })
  @Column({ type: DataType.TEXT })
  description!: string;

  @ApiProperty({ example: "1.10.2020", description: "дата приемьеры фильма" })
  @Column({ type: DataType.TEXT })
  premiereCountry!: string;

  @ApiProperty({ example: "слоган", description: "слоган фильма" })
  @Column({ type: DataType.TEXT })
  slogan!: string;

  @ApiProperty({ example: "url", description: "url картинки фильма" })
  @Column({ type: DataType.TEXT })
  bigPictureUrl!: string;

  @ApiProperty({ example: "url", description: "url картинки фильма" })
  @Column({ type: DataType.TEXT })
  smallPictureUrl!: string;

  @ApiProperty({ example: "2022", description: "год создания фильма" })
  @Column({ type: DataType.INTEGER })
  year!: number;

  @ApiProperty({ example: "1", description: "номер в топ10" })
  @Column({ type: DataType.INTEGER })
  top10!: number;

  @ApiProperty({ example: "1", description: "номер в топ250" })
  @Column({ type: DataType.INTEGER })
  top250!: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- PG literal не в типах Sequelize
  @Column({ type: "TIMESTAMP(3) WITHOUT TIME ZONE" as any })
  premiereWorldDate!: Date;

  @Column({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- PG literal не в типах Sequelize
    type: "TIMESTAMP(3) WITHOUT TIME ZONE" as any,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  createdAt!: Date;

  @BelongsToMany(() => Person, () => FilmPerson)
  persons!: Person[];

  @BelongsToMany(() => Country, () => FilmCountry)
  countries!: Country[];

  @BelongsToMany(() => Genre, () => FilmGenre)
  genres!: Genre[];

  @HasMany(() => Fact)
  facts!: Fact[];

  @HasMany(() => Comment)
  comments!: Comment;
}
