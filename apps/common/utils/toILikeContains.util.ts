/**
 * Паттерн ILIKE `%q%` без wildcard из пользовательского ввода:
 * `%` / `_` вырезаются (иначе поиск «100%» матчит всё).
 * Если после санитизации пусто (`%`, `___`) — `undefined` (caller → пустой список).
 */
export function toILikeContains(q: string): string | undefined {
  const sanitized = q.replace(/[%_]/g, "");
  return sanitized ? `%${sanitized}%` : undefined;
}
