import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { Film } from "../films/films.model";
import { FilmCountry } from "../films/filmCountry";
import { TCountryCreationAtt, TCountryModel } from "@common/types";

@Table({ tableName: "Country", timestamps: false })
export class Country extends Model<TCountryModel, TCountryCreationAtt> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.STRING, unique: true })
  countryName!: string;

  @Column({ type: DataType.STRING, unique: true })
  countryNameEn!: string;

  @BelongsToMany(() => Film, () => FilmCountry)
  films!: Film[];
}
