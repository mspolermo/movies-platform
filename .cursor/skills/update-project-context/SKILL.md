---
name: update-project-context
description: >-
  Обновляет базу знаний проекта под `.cursor/` после задач, меняющих код или
  архитектуру (project-index, architecture, context, ADR). Использовать когда
  появился модуль/RPC/правило, изменилась архитектура, или пользователь просит
  актуализировать PROJECT_CONTEXT / документацию агента.
---

# Update Project Context

Выполнять **после** любой задачи, меняющей код или архитектуру.

## Цель

Держать базу знаний актуальной. Всё под `.cursor/` (кроме корневых `PROJECT_CONTEXT.md` и `README.md`).

Точки входа: `PROJECT_CONTEXT.md` → `.cursor/project-index.md` → `.cursor/context/*`.

---

## Чеклист (обязателен)

### 1. Новый модуль / домен / FSD-слайс?

**Да →** обновить [`.cursor/project-index.md`](../../project-index.md).

### 2. Изменилась архитектура / поток данных / слои?

**Да →** обновить [`.cursor/architecture.md`](../../architecture.md)  
и при необходимости [`.cursor/dependency-graph.md`](../../dependency-graph.md).

### 3. Новый или изменённый RPC / MessagePattern?

**Да →**  
- контракт в `apps/common/services/rmq/messaging/`  
- запись в project-index («Все RPC»)  
- при смене направления — dependency-graph  
- правило в `context/microservices.md` / `context/api.md`, если процесс изменился

### 4. Новый DTO / публичный тип ответа-запроса?

**Да →** кратко в project-index или glossary;  
ссылка на `apps/common/types/...`, без копипасты полей.  
Соблюдать `context/naming.md` и `.cursor/rules/common-types-rules.mdc`.

### 5. Изменились правила разработки?

**Да →** обновить файл в [`.cursor/context/`](../../context/).

### 6. Архитектурное решение (новое / смена статуса)?

**Да →** ADR в [`.cursor/adr/`](../../adr/) + строка в [`adr/README.md`](../../adr/README.md).

### 7. Удалены компоненты / эндпоинты / RPC / слайсы?

**Да →** удалить упоминания из index, architecture, dependency-graph, glossary, context.

### 8. Контекстный слой (PR-шаблон)

Источник: [`../../context/PULL_REQUEST_TEMPLATE.md`](../../context/PULL_REQUEST_TEMPLATE.md).

- [ ] Публичное поведение / контракт? → PROJECT_CONTEXT / project-index / context/api / ADR  
- [ ] Новый инвариант / запрет? → `context/*.md` или ADR  
- [ ] Удалена функциональность из docs? → упоминания сняты  
- [ ] Формат артефакта (adr/skill/шаблон)? → обновлены

### 9. Финальная проверка

- [ ] `PROJECT_CONTEXT.md` — стек и ссылки верны  
- [ ] `.cursor/project-index.md` — API/RPC/пути совпадают с кодом  
- [ ] `.cursor/dependency-graph.md` — нет запрещённых рёбер  
- [ ] `.cursor/context/*` — нет противоречий с кодом  
- [ ] `.cursor/adr/README.md` — реестр актуален  
- [ ] Пункт 8 закрыт  

### 10. Нет изменений в знаниях?

**Ничего не менять.** Не писать документацию «ради галочки».

Черновики / долг / аудиты → [`.cursor/temp/`](../../temp/).

---

## Стиль правок

- Краткие списки и таблицы.
- Без копипасты кода.
- Ссылки вместо дублирования.
- Язык: русский.

## Связанные пути

| Путь | Роль |
|------|------|
| `PROJECT_CONTEXT.md` | Вход |
| `.cursor/project-index.md` | Карта |
| `.cursor/architecture.md` | Слои/потоки |
| `.cursor/dependency-graph.md` | Вызовы |
| `.cursor/glossary.md` | Термины |
| `.cursor/context/` | Правила |
| `.cursor/adr/` | Решения |
| `.cursor/temp/` | Черновики, техдолг |
| `.cursor/skills/update-project-context/SKILL.md` | Этот skill |
