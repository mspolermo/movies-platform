import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { Profession } from "../professions/professions.model";

import { Person } from "./persons.model";

@Table({
  tableName: "_PersonToProfession",
  createdAt: false,
  updatedAt: false,
  indexes: [{ name: "_PersonToProfession_B_index", fields: ["B"] }],
})
export class PersonProfession extends Model<PersonProfession> {
  @ForeignKey(() => Person)
  @Column({ type: DataType.INTEGER, allowNull: false })
  A!: number;

  @ForeignKey(() => Profession)
  @Column({ type: DataType.INTEGER, allowNull: false })
  B!: number;
}
