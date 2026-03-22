# Film Search

Приложение для поиска фильмов на `React + TypeScript + VKUI`.

Проект использует API `poiskkino.dev` и включает:
- каталог фильмов с фильтрами по жанрам, рейтингу и году;
- бесконечную подгрузку карточек;
- страницу с подробной информацией о фильме;
- сравнение фильмов;
- избранное на стороне клиента.

## Стек

- React 19
- TypeScript
- Vite
- VKUI
- React Router
- TanStack Query
- Axios
- Zod

## Запуск проекта

1. Установите зависимости:

```bash
npm install
```

2. Создайте файл `.env.local` на основе `.env.default`.

Пример:

```env
VITE_APP_TITLE=Film Search
VITE_POISKKINO_API_BASE_URL=https://api.poiskkino.dev
VITE_POISKKINO_API_KEY=your-api-key
```

3. Запустите приложение в режиме разработки:

```bash
npm run dev
```

4. Откройте адрес, который покажет Vite в терминале.