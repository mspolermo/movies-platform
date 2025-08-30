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
import { GenreCreationAtt, GenreModel } from "@common/types";

@Table({ tableName: "Genre", timestamps: false })
export class Genre extends Model<GenreModel, GenreCreationAtt> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "драма", description: "Имя жанра на русском" })
  @Column({ type: DataType.STRING, unique: true })
  nameRu: string;

  @ApiProperty({ example: "drama", description: "Имя жанра нв английском" })
  @Column({ type: DataType.STRING, unique: true })
  nameEn: string;

  @BelongsToMany(() => Film, () => FilmGenre)
  films: Film[];
}
