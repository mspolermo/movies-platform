/** Доменная сущность роли с полями, которые реально хранятся в таблице. */
export interface TRoleEntity {
  id: number;
  value: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}