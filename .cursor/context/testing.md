# Testing Rules

## Фреймворки (факт)

| Область | Инструмент | Статус |
|---------|------------|--------|
| Backend | Jest (+ Nest testing) | Unit/controller specs в kino-db, auth-users; частично gateway |
| Frontend | Vitest + Testing Library | **0** тестов в `src/`; `vitest.config` → `src/test/setup.ts` **отсутствует** |
| api-gateway | Jest | Только films (2 specs); auth/search/filters/comments — пробел |
| E2E | Playwright / Cypress | **Нет** — не добавлять без ADR |
| HTTP integration | Supertest | В deps, в коде **не используется** |

Backend всего ≈23 `*.spec.ts` (kino-db ~17, auth-users 4, gateway 2). Не покрыто: `tokens`, mappers, весь client, e2e.

## Backend

- Имя: `*.spec.ts` рядом с модулем (`*/tests/` или рядом с файлом — как в домене).
- AAA: Arrange-Act-Assert; переменные `inputX`, `mockX`, `actualX`, `expectedX`.
- Мокать: Sequelize models/repos, RmqService/ClientProxy, TokensService.
- Не поднимать реальный RabbitMQ/Postgres в unit.
- Публичные методы сервисов — приоритет покрытия; facade можно тестировать через делегаты или тонкий smoke.

## Frontend

- Запуск: `cd apps/client && npm test` (Vitest).
- Тестировать: чистые utils, hooks (RTL), критичные UI-состояния auth.
- Не снапшотить огромные страницы без нужды.
- Моки API: не ходить в gateway в unit.

## Общее

- Тест должен быть детерминированным.
- Не коммитить `.only` / отключённые сюиты без причины.
- Новый модуль → минимум unit на сервис (backend) или utils (frontend).
- Покрытие e2e critical path (login → profile) — желательно через ADR + Playwright позже.
