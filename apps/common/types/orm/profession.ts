import { TPersonEntity, TProfessionEntity } from "../entity";

// Тип для создания профессии
export interface TProfessionCreationAtt extends Pick<TProfessionEntity, "name"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TProfessionOrmModel extends TProfessionEntity {
  persons?: TPersonEntity[]; // Связи Sequelize
}