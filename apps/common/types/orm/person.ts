// Общие типы для Person
import { TFilmEntity, TPersonEntity, TProfessionEntity } from "../entity";

// Тип для создания персоны
export interface TPersonCreationAtt extends Pick<TPersonEntity, "nameRu" | "nameEn"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TPersonOrmModel extends TPersonEntity {
  professions?: TProfessionEntity[]; // Связи Sequelize
  films?: TFilmEntity[]; // Связи Sequelize
}
