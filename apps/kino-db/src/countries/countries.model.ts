import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { Film } from "../films/films.model";
import { FilmCountry } from "../films/filmCountry";
import { TCountryCreationAtt, TCountryOrmModel } from "@common/types";

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
