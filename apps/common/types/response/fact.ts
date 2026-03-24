import type { TFactEntity } from "../entity";

/** Факт в составе детальной информации о фильме. */
export type TFilmFactResponse = Pick<TFactEntity, "type" | "value" | "spoiler">;
