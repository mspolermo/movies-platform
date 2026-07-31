import type {
  TUserFilmRatingCreationAtt,
  TUserFilmRatingOrmModel,
} from "@common/types/orm";

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import {
  FILM_USER_GRADE_MAX,
  FILM_USER_GRADE_MIN,
} from "@common/constants";

import { User } from "../../users/models/users.model";

/** Оценка фильма пользователем. */
@Table({
  tableName: "user_film_ratings",
  indexes: [
    {
      unique: true,
      fields: ["userId", "filmId"],
    },
    {
      name: "user_film_ratings_userId_updatedAt_id_idx",
      fields: ["userId", "updatedAt", "id"],
    },
  ],
})
export class UserFilmRating extends Model<
  TUserFilmRatingOrmModel,
  TUserFilmRatingCreationAtt
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: "CASCADE",
  })
  userId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  filmId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: FILM_USER_GRADE_MIN,
      max: FILM_USER_GRADE_MAX,
    },
  })
  grade!: number;

  @BelongsTo(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  user!: User;
}
