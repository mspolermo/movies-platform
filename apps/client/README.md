# Movies Platform Client

Frontend приложение для платформы фильмов, построенное на Next.js 15 с использованием FSD архитектуры.

## Технологии

- **Next.js 15** - React фреймворк с App Router
- **React 19** - UI библиотека
- **TypeScript** - типизированный JavaScript
- **Zustand** - стейт-менеджмент
- **SCSS Modules** - стилизация
- **FSD** - Feature-Sliced Design архитектура

## Структура проекта

```
src/
├── app/                 # Next.js App Router страницы
├── entities/           # Бизнес-сущности
├── features/           # Функциональные модули
├── widgets/            # Композитные компоненты
├── shared/             # Общие ресурсы
│   ├── api/           # API клиент и эндпойнты
│   ├── types/         # TypeScript типы
│   ├── ui/            # UI компоненты
│   └── utils/         # Утилиты
└── styles/             # Глобальные стили
```

## Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### 3. Сборка для продакшена

```bash
npm run build
npm start
```

## Доступные скрипты

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка приложения
- `npm run start` - запуск собранного приложения
- `npm run lint` - проверка кода ESLint
- `npm run test` - запуск тестов
- `npm run format` - форматирование кода Prettier
- `npm run type-check` - проверка типов TypeScript

## API интеграция

Приложение интегрировано с backend API через `/api` прокси:

- **Аутентификация**: `/api/auth/*`
- **Фильмы**: `/api/films/*`
- **Жанры**: `/api/genres/*`
- **Страны**: `/api/countries/*`
- **Персоны**: `/api/persons/*`
- **Комментарии**: `/api/comments/*`

## Аутентификация

- JWT токены хранятся в Zustand store с персистентностью
- Автоматическое добавление токена к API запросам
- Редирект на `/login` при истечении токена

## Страницы

- `/auth/login` - форма входа
- `/films` - список фильмов
- `/genres` - список жанров
- `/countries` - список стран
- `/persons` - список персон
- `/comments` - список комментариев
- `/profile` - профиль пользователя

## Разработка

### Добавление новой страницы

1. Создайте директорию в `src/app/`
2. Добавьте `page.tsx` с компонентом страницы
3. Создайте стили в `.module.scss` файле
4. Добавьте ссылку в навигацию

### Добавление нового API эндпойнта

1. Добавьте эндпойнт в `src/shared/api/endpoints.ts`
2. Создайте типы в `src/shared/types/index.ts`
3. Используйте `apiClient` для запросов

## Тестирование

```bash
npm run test          # Запуск тестов
npm run test:ui       # Запуск тестов с UI
```

## Линтинг и форматирование

```bash
npm run lint          # Проверка ESLint
npm run format        # Форматирование Prettier
```
