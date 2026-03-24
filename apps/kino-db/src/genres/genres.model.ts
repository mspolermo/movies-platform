import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { Film } from "../films/films.model";
import { FilmGenre } from "../films/filmGenre";
import { ApiProperty } from "@nestjs/swagger";
import { TGenreCreationAtt, TGenreOrmModel } from "@common/types";

@Table({ tableName: "Genre", timestamps: false })
export class Genre extends Model<TGenreOrmModel, TGenreCreationAtt> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ApiProperty({ example: "драма", description: "Имя жанра на русском" })
  @Column({ type: DataType.TEXT, unique: true, allowNull: false })
  nameRu!: string;

  @ApiProperty({ example: "drama", description: "Имя жанра нв английском" })
  @Column({ type: DataType.TEXT })
  nameEn!: string;

  @BelongsToMany(() => Film, () => FilmGenre)
  films!: Film[];
}
