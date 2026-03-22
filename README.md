# Film Search

Одностраничное приложение для поиска фильмов на `React + TypeScript + VKUI`.

Теперь проект использует API сервиса `poiskkino.dev`:
- каталог с фильтрами по жанрам, рейтингу и году;
- карточки фильмов с бесконечной подгрузкой;
- отдельная страница деталей;
- сравнение и избранное на стороне клиента.

## Стек

- React 19
- TypeScript
- Vite
- VKUI
- React Router
- TanStack Query
- Axios
- Zod

## Запуск

1. Установить зависимости:

```bash
npm install
```

2. Создать `.env.local` на основе `.env.default` и указать ключ `PoiskKino`.

```env
VITE_APP_TITLE=Film Search
VITE_POISKKINO_API_BASE_URL=https://api.poiskkino.dev
VITE_POISKKINO_API_KEY=replace-with-local-api-key
```

3. Запустить приложение:

```bash
npm run dev
```

## Скрипты

```bash
npm run dev
npm run build
npm run lint
npm run test
```

## TDD

Миграция API покрыта тестами на:
- сериализацию фильтров в URL;
- сборку query-параметров для `PoiskKino`;
- маппинг списка фильмов, деталей и жанров без реальных сетевых вызовов.
