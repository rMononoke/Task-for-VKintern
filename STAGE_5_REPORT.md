# Stage 5 Report

## Этап

Этап 5 посвящен сравнению фильмов.

## Что было реализовано

- выбор до двух фильмов для сравнения;
- автоматический сброс самого старого выбора при добавлении третьего фильма;
- сравнительная таблица;
- поддержка длительности фильма через догрузку деталей;
- управление сравнением из каталога и страницы фильма.

## Ключевые модули

- `src/features/comparison/model/comparisonSelection.ts`
- `src/features/comparison/model/ComparisonProvider.tsx`
- `src/features/comparison/model/ComparisonContext.ts`
- `src/features/comparison/model/useComparison.ts`
- `src/features/comparison/model/useComparisonMovieDetails.ts`
- `src/features/comparison/ui/MovieComparisonPanel.tsx`

## Подход

Состояние сравнения хранится отдельно от server-state, а дополняющие данные подгружаются через `react-query`, чтобы не дублировать весь набор полей в карточке фильма.
