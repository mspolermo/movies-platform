import { TFilmGenreEntity } from "@common/types/entity";

/** Атрибуты для Sequelize.create связи фильма с жанром. */
export type TFilmGenreCreationAtt = TFilmGenreEntity;

/** Sequelize-тип связи фильма с жанром. */
export type TFilmGenreOrmModel = TFilmGenreEntity;