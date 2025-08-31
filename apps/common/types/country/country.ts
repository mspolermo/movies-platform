export interface Country {
  id: number;
  countryName: string;
  countryNameEn: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания страны
export interface CountryCreationAtt extends Pick<Country, "countryName" | "countryNameEn"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface CountryModel extends Country {
  films?: any[]; // Связи Sequelize
}
