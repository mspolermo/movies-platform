export interface TCountryBased {
  id: number;
  countryName: string;
  countryNameEn: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания страны
export interface TCountryCreationAtt extends Pick<TCountryBased, "countryName" | "countryNameEn"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TCountryModel extends TCountryBased {
  films?: any[]; // Связи Sequelize
}
