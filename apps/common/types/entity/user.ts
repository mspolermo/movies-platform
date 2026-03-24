/** Доменная сущность пользователя с полями, которые реально хранятся в таблице. */
export interface TUserEntity {
  id: number;
  email: string;
  password?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
