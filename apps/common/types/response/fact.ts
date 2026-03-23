import type { TFactEntity } from "../fact";

/** Факт в составе детальной информации о фильме. */
export type TFilmFactResponse = Pick<TFactEntity, "value" | "spoiler">;
