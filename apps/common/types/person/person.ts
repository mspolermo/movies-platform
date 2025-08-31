// Общие типы для Person

export interface Person {
  id: number;
  photoUrl: string;
  nameRu: string;
  nameEn: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания жанра Персоны
export interface PersonCreationAtt extends Pick<Person, "nameRu" | "nameEn"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface PersonModel extends Person {
  professions?: any[]; // Связи Sequelize
  films?: any[]; // Связи Sequelize
}
