# 006. Без OAuth (email/password JWT)

- **Статус:** Accepted
- **Дата:** 2026-07-29
- **Участники:** —

## Контекст

В backlog (F2) рассматривались Google + VK. В коде был только мёртвый stub: `OauthCreateUserDto` + RPC `outRegistration` → `oauthCreateUser` (всегда `501`). Gateway HTTP, Passport, env client IDs, поля provider в User — отсутствовали. Продуктовой задачи на social login нет.

## Решение

**OAuth / social login не делаем.** Канон auth — email/password + JWT ([ADR-001](./001-jwt-access-opaque-refresh.md)).

Stub удалён:

- `OauthCreateUserDto`
- RPC `outRegistration`
- `UsersService.oauthCreateUser` / handler

Запрещено без нового ADR:

- OAuth HTTP на gateway, Passport/strategies, provider env
- Nullable password / oauth provider columns без отдельного решения
- Возврат `outRegistration` «на будущее»

## Последствия

**Плюсы**

- Нет мёртвого контракта и orphan RPC
- Проще модель User и surface auth

**Минусы**

- Social login потребует нового ADR + полный вертикальный срез

## Альтернативы

1. **Довести OAuth** — отвергнуто: нет продукта, stub не реализация.
2. **Оставить stub** — отвергнуто: шум в контракте и тестах.
