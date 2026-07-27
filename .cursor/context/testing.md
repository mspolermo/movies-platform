# Testing Rules

## Фреймворки (факт)

| Область | Инструмент | Статус |
|---------|------------|--------|
| Backend | Jest (+ Nest testing) | Unit/controller specs в kino-db, auth-users; частично gateway |
| Frontend | Vitest 3 + Testing Library | Unit/utils + UI kit; config: `configs/vitest/` (Vite 6 + `@vitejs/plugin-react`) |
| Frontend UI catalog | Storybook 10 (`@storybook/nextjs-vite`) | `shared/ui/**/stories`; config: `configs/storybook/` |
| api-gateway | Jest | Только films (2 specs); auth/search/filters/comments — пробел |
| E2E | Playwright / Cypress | **Нет** — не добавлять без ADR |
| HTTP integration | Supertest | В deps, в коде **не используется** |

Backend всего ≈23 `*.spec.ts` (kino-db ~17, auth-users 4, gateway 2). Client: session/auth utils + `shared/ui` smoke. Не покрыто e2e.

## Backend

- Имя: `*.spec.ts` рядом с модулем (`*/tests/` или рядом с файлом — как в домене).
- AAA: Arrange-Act-Assert; переменные `inputX`, `mockX`, `actualX`, `expectedX`.
- Мокать: Sequelize models/repos, RmqService/ClientProxy, TokensService.
- Не поднимать реальный RabbitMQ/Postgres в unit.
- Публичные методы сервисов — приоритет покрытия; facade можно тестировать через делегаты или тонкий smoke.

## Frontend

- Запуск unit: `cd apps/client && npm test` (Vitest 3, `configs/vitest/vitest.config.ts`, общий Vite 6 с Storybook).
- Typecheck tooling: `tsc -p tsconfig.tooling.json` (входит в `npm run type-check`) — `configs/vitest|storybook|mocks`.
- Запуск Storybook: `cd apps/client && npm run storybook` (`configs/storybook/`); сборка: `npm run build-storybook`.
- Setup: `configs/vitest/vitest.setup.ts` — `@testing-library/jest-dom/vitest` + глобальный mock `next/image` через `configs/mocks/next-image.tsx` (не дублировать в тестах).
- SB `next/image`: тот же `configs/mocks/next-image.tsx` (alias в `storybook/main`); preview decorator задаёт `color: var(--color-text)`. Addon a11y — `@storybook/addon-a11y`.
- Тестировать: чистые utils, session modules под `shared/api/session/<name>/`, authActions, `resolveSessionRedirect`.
- UI-kit: `shared/ui/<Name>/tests/*.test.tsx` (поведение + a11y-контракт); stories — `shared/ui/<Name>/stories/*.stories.tsx`. Шаблон `cc` — assert `className` на root, не smoke по имени слайса.
- Portal-компоненты (Modal/Overlay): тесты open-path — Escape, backdrop, scroll lock, focus; stories — controlled `isOpen`.
- Не снапшотить огромные страницы без нужды.
- Моки API: не ходить в gateway в unit.

## Общее

- Тест должен быть детерминированным.
- Не коммитить `.only` / отключённые сюиты без причины.
- Новый модуль → минимум unit на сервис (backend) или utils/UI smoke (frontend).
- Покрытие e2e critical path (login → profile) — желательно через ADR + Playwright позже.
