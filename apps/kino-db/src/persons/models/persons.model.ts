import type { TPersonCreationAtt, TPersonOrmModel } from "@common/types/orm";

import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

import { FilmPerson } from "../../films/models/filmPerson.model";
import { Film } from "../../films/models/films.model";
import { Profession } from "../../professions/models/professions.model";

import { PersonProfession } from "./personProfession.model";


@Table({ tableName: "Person", timestamps: false })
export class Person extends Model<TPersonOrmModel, TPersonCreationAtt> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ApiProperty({ description: "url фотографии" })
  @Column({ type: DataType.TEXT })
  photoUrl!: string;

  @ApiProperty({ example: "Энди", description: "Имя на русском" })
  @Column({ type: DataType.TEXT })
  nameRu!: string;

  @ApiProperty({ example: "Andy", description: "Имя на английском" })
  @Column({ type: DataType.TEXT })
  nameEn!: string;

  @BelongsToMany(() => Profession, () => PersonProfession)
  professions!: Profession[];

  @BelongsToMany(() => Film, () => FilmPerson)
  films!: Film[];
}
