export interface Genre {
  id: number;
  nameRu: string;
  nameEn: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания жанра
export interface GenreCreationAtt extends Pick<Genre, "nameRu" | "nameEn"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface GenreModel extends Genre {
  films?: any[]; // Связи Sequelize
}