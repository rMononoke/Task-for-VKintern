# Stage 4 Report

## Этап

Этап 4 посвящен функциональности `Избранное`.

## Что было добавлено

- отдельная страница избранных фильмов;
- сохранение списка в `localStorage`;
- подтверждение добавления через кастомную модалку;
- удаление фильма из избранного;
- отображение пустого состояния.

## Ключевые модули

- `src/features/favorites/model/favoritesStorage.ts`
- `src/features/favorites/model/FavoritesProvider.tsx`
- `src/features/favorites/model/FavoritesContext.ts`
- `src/features/favorites/model/useFavorites.ts`
- `src/features/favorites/ui/FavoriteConfirmModal.tsx`
- `src/pages/favorites/FavoritesPage.tsx`

## Подход

Логика работы с `localStorage` вынесена в отдельный модуль, а пользовательское состояние держится в `FavoritesProvider`, чтобы переиспользовать его и в каталоге, и на странице деталей фильма.
