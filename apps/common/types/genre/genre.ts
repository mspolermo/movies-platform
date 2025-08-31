// Полный базовый тип для жанра
export interface TGenreBased {
  id: number;
  nameRu: string;
  nameEn: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания жанра
export interface TGenreCreationAtt extends Pick<TGenreBased, "nameRu" | "nameEn"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TGenreModel extends TGenreBased {
  films?: any[]; // Связи Sequelize
}