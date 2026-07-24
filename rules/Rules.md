# Project rules

## Стек
- Node.js 20, TypeScript strict, Fastify.
- Кэш - Redis (Upstash). Формат ключа: `<сервис>:v<схема>:<id>`
- Логи - Pino, structured, поля `request_id`, `span_id` обязательны.

## Команды
- Тесты: `pnpm test` (минимально - `pnpm test:unit`).
- Линтер: `pnpm lint`. Без зеленого линтера в merge не идёт.

## Инварианты (не ломать без отдельного PR с обсуждением)
- Контракты в `packages/api-contract/` - public API, любое изменение версии + обновление потребителей.
- Миграции в `db/migrations/` - append-only, никогда не редактировать существующие.
- В логи никогда не уходят: токены, e-mail в полном виде, тело платёжных payload-ов.

## Точки расширения
- Новый эндпойнт: `apps/api/routes/<domain>/` + контракт в `api-contract` + тест.
- Feature-флаги: `packages/flags/`. Изменение дефолта = ADR.