import type { TFilmCountryEntity } from "@common/types/entity";

/** Атрибуты для Sequelize.create связи фильма со страной. */
export type TFilmCountryCreationAtt = TFilmCountryEntity;

/** Sequelize-тип связи фильма со страной. */
export type TFilmCountryOrmModel = TFilmCountryEntity;