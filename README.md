# Film Search

Многстраничное SPA-приложение для просмотра информации о фильмах на `React + TypeScript + VKUI`.

В проекте уже подготовлены:

- `react-router` для навигации;
- `@tanstack/react-query` для server state;
- `axios` для работы с API;
- `vitest + testing-library + msw` как база для TDD;
- каркас доменной модели под `kinopoiskapiunofficial`.

## Стек

- React 19
- TypeScript
- Vite
- VKUI
- React Router
- TanStack Query
- Axios
- Zod
- Vitest
- React Testing Library
- MSW

## Запуск

1. Установить зависимости:

```bash
npm install
```

2. Проверить переменные окружения.

Для шаблона есть файл `.env.default`.

Для локальной разработки используется `.env.local`.

3. Запустить dev-сервер:

```bash
npm run dev
```

## Скрипты

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:watch
```

## Переменные окружения

```env
VITE_APP_TITLE=Film Search
VITE_KINOPOISK_API_BASE_URL=https://kinopoiskapiunofficial.tech/api/v2.2
VITE_KINOPOISK_API_KEY=replace-with-local-api-key
```

## Структура

```text
src/
  app/            # провайдеры, роутер, layout
  entities/       # типы, мапперы, api доменов
  pages/          # страницы приложения
  shared/         # инфраструктурный код
  test/           # test setup и утилиты
```

## TDD-подход

Дальше разработка пойдет итерациями:

1. Пишем тесты на чистую логику и API-модули.
2. Добавляем пользовательские сценарии страниц.
3. После этого собираем UI и интеграции.
