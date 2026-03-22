---
name: zapusti-linting
description: >-
  Запускает тот же линтинг и проверку типов для apps/client, что и хук
  client-post-agent-stop.sh (lint:fix + type-check). Использовать когда пользователь
  просит «запусти линтинг», проверить eslint/tsc в клиенте, или повторить сценарий
  post-agent hook вручную.
---

# Запусти линтинг (client post-agent hook)

## Что делать

1. Рабочая директория — **корень репозитория** (`movies-platform`), не `apps/client`.
2. Выполнить хук:

```bash
bash .cursor/hooks/client-post-agent-stop.sh < /dev/null
```

Либо передать пустой JSON на stdin (эквивалентно для `loop_count`):

```bash
echo '{}' | bash .cursor/hooks/client-post-agent-stop.sh
```

## Поведение скрипта (важно)

- Скрипт сам переходит в `apps/client` и запускает **`npm run lint:fix`**, затем **`npm run type-check`**.
- Если в `apps/client` **нет** ни изменений в рабочем дереве, ни diff относительно `HEAD`, скрипт **ничего не запускает** и завершается (как в режиме Cursor hook).
- При ошибках линтера/tsc скрипт может вывести JSON с `followup_message` в stdout — показать пользователю вывод команды и содержимое follow-up, если оно есть.

## Если нужен линт без условия «есть изменения в client»

Тогда не хук, а напрямую:

```bash
cd apps/client && npm run lint:fix && npm run type-check
```

Это уже другой сценарий; хук его не дублирует по условиям git.
