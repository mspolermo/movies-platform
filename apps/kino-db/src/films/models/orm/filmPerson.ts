import { TFilmPersonEntity } from "@common/types/entity";

/** Атрибуты для Sequelize.create связи фильма с персоной. */
export type TFilmPersonCreationAtt = TFilmPersonEntity;

/** Sequelize-тип связи фильма с персоной. */
export type TFilmPersonOrmModel = TFilmPersonEntity;