# Project Digest

## Общая идея

`Film Search` — SPA-приложение для просмотра информации о фильмах, построенное на `React`, `TypeScript`, `VKUI`, `React Router` и `TanStack Query`.

## Что реализовано

- каталог фильмов с подгрузкой батчами;
- фильтры по жанрам, рейтингу и году выпуска;
- синхронизация фильтров с `searchParams`;
- страница подробной информации о фильме;
- избранное с подтверждением и сохранением в `localStorage`;
- сравнение до двух фильмов;
- переключение светлой и темной темы.

## Архитектура

```text
src/
  app/
    layout/
    providers/
    router/
    theme/
  entities/
    movie/
  features/
    comparison/
    favorites/
    movie-catalog/
    movie-filters/
  pages/
    favorites/
    home/
    movie-details/
    not-found/
  shared/
    api/
    config/
    lib/
  test/
```

## Основные библиотеки

- `@vkontakte/vkui`
- `@tanstack/react-query`
- `axios`
- `react-router`
- `zod`
- `vitest`
- `@testing-library/react`
- `@testing-library/user-event`

## Источник данных

Приложение работает с `Kinopoisk Unofficial API`. Конфигурация выносится в `.env.local`, шаблон хранится в `.env.default`.

## Проверка

Рабочее состояние проекта подтверждается командами:

```bash
npm run test
npm run lint
npm run build
```
