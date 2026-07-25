# Performance Rules

## Backend

- Избегать N+1: явные `include` / отдельные queries в `films/queries`.
- Пагинация обязательна на списках; лимиты — `@common/constants` (`LIST_*`).
- Не делать лишний fan-out RMQ на gateway (filters уже бьёт в 3 RPC — не копировать паттерн без кэша).
- Тяжёлые `ILIKE %query%` — осознанный risk; для роста — trigram/search engine (ADR).
- Одна очередь на сервис: долгие jobs не должны душить health/read (пока нет приоритетов — держать handlers быстрыми).

## Frontend

- RSC/SSR для первичных данных страницы; клиент — для интеракций и load-more.
- Картички/постеры: существующие remote poster / размеры; не грузить full detail в списках.
- Карусели: учитывать `prefers-reduced-motion`.
- Не класть тяжёлые клиентские библиотеки без нужды (React Query не подключать «на всякий»).

## Caching (текущее состояние)

- Redis/CDN кэша справочников нет.
- При добавлении кэша: ключи версионировать; инвалидация — часть ADR.

## Observability

- Healthchecks не должны зависеть от тяжёлых запросов к БД без таймаута.
- Correlation/trace id через RMQ — желательно при развитии (сейчас нет системно).
