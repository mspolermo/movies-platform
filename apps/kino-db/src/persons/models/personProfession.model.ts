import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import { Profession } from "../../professions/models/professions.model";

import { TPersonProfessionCreationAtt, TPersonProfessionOrmModel } from "./orm/personProfession";
import { Person } from "./persons.model";

//TODO: A и B переделать на нормальные колонки 
@Table({
  tableName: "_PersonToProfession",
  createdAt: false,
  updatedAt: false,
  indexes: [{ name: "_PersonToProfession_B_index", fields: ["B"] }],
})
export class PersonProfession extends Model<TPersonProfessionOrmModel, TPersonProfessionCreationAtt> {
  @ForeignKey(() => Person)
  @Column({ type: DataType.INTEGER, allowNull: false })
  A!: number;

  @ForeignKey(() => Profession)
  @Column({ type: DataType.INTEGER, allowNull: false })
  B!: number;
}
