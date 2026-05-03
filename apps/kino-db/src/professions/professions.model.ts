import type { TProfessionCreationAtt, TProfessionOrmModel } from "@common/types/orm";

import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

import { PersonProfession } from "../persons/models/personProfession.model";
import { Person } from "../persons/persons.model";

@Table({ tableName: "Profession", timestamps: false })
export class Profession extends Model<TProfessionOrmModel, TProfessionCreationAtt> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.TEXT, unique: true, allowNull: false })
  name!: string;

  @BelongsToMany(() => Person, () => PersonProfession)
  persons!: Person[];
}
