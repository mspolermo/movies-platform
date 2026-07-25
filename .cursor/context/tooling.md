# Tooling Rules

Инварианты линтинга и TypeScript. Не смешивать конфиги client и backend.

## ESLint — два входа (обязательно)

| Где | Конфиг | Команда |
|-----|--------|---------|
| Backend + `apps/common` | корневой `eslint.config.mjs` | из корня: `npm run lint` / `npm run lint:fix` |
| Frontend | `apps/client/eslint.config.mjs` | `cd apps/client && npm run lint` |

- Nest и Next — разные среды; `apps/client` в корневом ESLint в `ignores`.
- Backend: `import/order` — external → `@common` → internal; группы с пустой строкой.
- IDE: в `.vscode/settings.json` два `eslint.workingDirectories` — `apps/client` и корень. Не ставить `eslint.nodePath` только на client.

## TypeScript — два контура

- Корень `tsconfig.json` — Nest (`commonjs`, декораторы, `@common`).
- `api-gateway` / `auth-users` / `kino-db` / `common` — `extends` корня.
- `apps/client/tsconfig.json` — **не** наследует корень (Next moduleResolution / jsx / FSD aliases).

## package.json

- Корень — Nest-сервер, backend lint/test.
- `apps/client/package.json` — отдельный граф зависимостей и свои скрипты.
- Не требовать установки корневых deps для сборки client.

## Запреты

- Не объединять eslint client+backend в один flat-config без ADR.
- Merge с красным lint (`--max-warnings 0`) запрещён.
