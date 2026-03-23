import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Film } from "./films.model";
import { Person } from "../persons/persons.model";

@Table({
  tableName: "_FilmToPerson",
  createdAt: false,
  updatedAt: false,
  indexes: [{ name: "_FilmToPerson_B_index", fields: ["B"] }],
})
export class FilmPerson extends Model<FilmPerson> {
  @ForeignKey(() => Film)
  @Column({ type: DataType.INTEGER, allowNull: false })
  A!: number;

  @ForeignKey(() => Person)
  @Column({ type: DataType.INTEGER, allowNull: false })
  B!: number;
}
