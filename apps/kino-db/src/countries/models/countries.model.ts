import type { TCountryCreationAtt, TCountryOrmModel } from "@common/types/orm";

import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

import { Film, FilmCountry } from "../../films";

@Table({ tableName: "Country", timestamps: false })
export class Country extends Model<TCountryOrmModel, TCountryCreationAtt> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.TEXT, unique: true, allowNull: false })
  countryName!: string;

  @Column({ type: DataType.TEXT })
  countryNameEn!: string;

  @BelongsToMany(() => Film, () => FilmCountry)
  films!: Film[];
}
