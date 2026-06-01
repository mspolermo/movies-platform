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
import { Country } from "../../countries/models/countries.model";
import { Genre } from "../../genres/models/genres.model";
import { Person } from "../../persons/models/persons.model";

import { Fact } from "./facts.model";
import { FilmCountry } from "./filmCountry.model";
import { FilmGenre } from "./filmGenre.model";
import { FilmPerson } from "./filmPerson.model";


@Table({
  tableName: "Film",
  timestamps: false,
})
export class Film extends Model<TFilmOrmModel, TFilmCreationAtt> {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор",
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ApiProperty({
    example: "Official Trailer",
    description: "Название трейлера",
  })
  @Column(DataType.TEXT)
  trailerName!: string;

  @ApiProperty({
    example: "https://youtube.com/...",
    description: "URL трейлера",
  })
  @Column(DataType.TEXT)
  trailerUrl!: string;

  @ApiProperty({
    example: 8.4,
    description: "Рейтинг Кинопоиска",
  })
  @Column(DataType.DOUBLE)
  ratingKp!: number;

  @ApiProperty({
    example: 120000,
    description: "Количество голосов Кинопоиска",
  })
  @Column(DataType.INTEGER)
  votesKp!: number;

  @ApiProperty({
    example: 7.9,
    description: "Рейтинг IMDb",
  })
  @Column(DataType.DOUBLE)
  ratingImdb!: number;

  @ApiProperty({
    example: 95000,
    description: "Количество голосов IMDb",
  })
  @Column(DataType.INTEGER)
  votesImdb!: number;

  @ApiProperty({
    example: 7.1,
    description: "Рейтинг кинокритиков",
  })
  @Column(DataType.DOUBLE)
  ratingFilmCritics!: number;

  @ApiProperty({
    example: 320,
    description: "Количество голосов кинокритиков",
  })
  @Column(DataType.INTEGER)
  votesFilmCritics!: number;

  @ApiProperty({
    example: 6.8,
    description: "Рейтинг российских критиков",
  })
  @Column(DataType.DOUBLE)
  ratingRussianFilmCritics!: number;

  @ApiProperty({
    example: 120,
    description: "Количество голосов российских критиков",
  })
  @Column(DataType.INTEGER)
  votesRussianFilmCritics!: number;

  @ApiProperty({
    example: 110,
    description: "Длительность фильма в минутах",
  })
  @Column(DataType.INTEGER)
  movieLength!: number;

  @ApiProperty({
    example: "en",
    description: "Язык оригинала",
  })
  @Column(DataType.TEXT)
  originalFilmLanguage!: string;

  @ApiProperty({
    example: "Интерстеллар",
    description: "Русское название фильма",
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  filmNameRu!: string;

  @ApiProperty({
    example: "Interstellar",
    description: "Английское название фильма",
  })
  @Column(DataType.TEXT)
  filmNameEn!: string;

  @ApiProperty({
    example: "Описание фильма",
    description: "Описание фильма",
  })
  @Column(DataType.TEXT)
  description!: string;

  @ApiProperty({
    example: "01.10.2020",
    description: "Дата премьеры в стране",
  })
  @Column(DataType.TEXT)
  premiereCountry!: string;

  @ApiProperty({
    example: "Mankind was born on Earth...",
    description: "Слоган фильма",
  })
  @Column(DataType.TEXT)
  slogan!: string;

  @ApiProperty({
    example: "https://image.jpg",
    description: "Большой постер",
  })
  @Column(DataType.TEXT)
  bigPictureUrl!: string;

  @ApiProperty({
    example: "https://small-image.jpg",
    description: "Маленький постер",
  })
  @Column(DataType.TEXT)
  smallPictureUrl!: string;

  @ApiProperty({
    example: 2022,
    description: "Год выпуска",
  })
  @Column(DataType.INTEGER)
  year!: number;

  @ApiProperty({
    example: 5,
    description: "Позиция в топ-10",
  })
  @Column(DataType.INTEGER)
  top10!: number;

  @ApiProperty({
    example: 42,
    description: "Позиция в топ-250",
  })
  @Column(DataType.INTEGER)
  top250!: number;

  @Column({
    type: DataType.DATE(3),
  })
  premiereWorldDate!: Date;

  @Column({
    type: DataType.DATE(3),
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
  comments!: Comment[];
}
