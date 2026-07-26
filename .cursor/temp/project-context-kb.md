# База знаний в `.cursor` (2026-07-24)

## Раскладка

| Путь | Роль |
|------|------|
| `PROJECT_CONTEXT.md` | Вход (корень) |
| `.cursor/project-index.md` и siblings | Компактный индекс |
| `.cursor/context/` | Правила (бывший `rules/`) |
| `.cursor/adr/` | ADR |
| `.cursor/skills/` | Skills агента |
| `.cursor/temp/` | Черновики, аудиты, техдолг |
| `.cursor/rules/*.mdc` | Cursor globs → `@.cursor/context/*` (FE/BE) |

## Wiring (2026-07-24)

- Корневой `.cursorrules` удалён.
- `frontend-dev-rules.mdc` / `backend-dev-nest-rules.mdc` — тонкие wrappers с `@.cursor/context/...` (без generic boilerplate / MikroORM).

## Удалено как дубли

- `docs/PROJECT_ARCHITECTURE.md` → канон `.cursor/architecture.md` + index; долг → `temp/backlog.md`
- `docs/auth-architecture.md` → ADR-001
- `docs/tooling.md` → `.cursor/context/tooling.md`
