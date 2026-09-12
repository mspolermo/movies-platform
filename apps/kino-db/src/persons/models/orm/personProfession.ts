import type { TPersonProfessionEntity } from "@common/types/entity";

/** Атрибуты для создания связи персоны с профессией. */
export type TPersonProfessionCreationAtt = TPersonProfessionEntity;

/** Sequelize-тип связи персоны с профессией. */
export type TPersonProfessionOrmModel = TPersonProfessionEntity;