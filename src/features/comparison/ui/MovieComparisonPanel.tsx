import { useId, useState } from 'react'
import { Button, Spinner, Text, Title } from '@vkontakte/vkui'

import type { MovieCard } from '@/entities/movie/model/types'
import type { ComparisonMovieDetails } from '@/features/comparison/model/useComparisonMovieDetails'

type MovieComparisonPanelProps = {
  selectedMovies: MovieCard[]
  comparisonMovies: ComparisonMovieDetails[]
  isPending: boolean
  onClear: () => void
}

function formatRating(rating: number | null) {
  return rating === null ? 'Нет оценки' : `KP ${rating.toFixed(1)}`
}

function formatYear(year: number | null) {
  return year === null ? 'Год не указан' : String(year)
}

function formatGenres(genres: string[]) {
  return genres.length > 0 ? genres.join(' • ') : 'Жанры не указаны'
}

function formatDuration(duration: number | null) {
  return duration === null ? 'Нет данных' : `${duration} мин`
}

export function MovieComparisonPanel({
  selectedMovies,
  comparisonMovies,
  isPending,
  onClear,
}: MovieComparisonPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const comparisonBodyId = useId()
  const comparisonMap = new Map(comparisonMovies.map((movie) => [movie.id, movie]))

  const rows = selectedMovies.map((movie) => {
    const details = comparisonMap.get(movie.id)

    return {
      id: movie.id,
      title: details?.title ?? movie.title,
      year: details?.year ?? movie.year,
      rating: details?.rating ?? movie.rating,
      genres: details?.genres ?? movie.genres,
      duration: details?.duration ?? null,
      posterUrlPreview: movie.posterUrlPreview,
      posterUrl: movie.posterUrl,
    }
  })

  return (
    <section className="surface-section comparison-panel">
      <div className="surface-section__header">
        <div className="surface-section__copy">
          <p className="surface-section__eyebrow">Сравнение</p>
          <h2 className="surface-section__title">
            <Title level="2" weight="2">
              Сравнение фильмов
            </Title>
          </h2>
          <Text>
            Можно выбрать до двух фильмов. Если добавить третий, самый ранний выбор
            автоматически удалится.
          </Text>
        </div>

        <div className="comparison-panel__controls">
          <span className="catalog-summary__item">Выбрано: {selectedMovies.length}/2</span>
          <Button
            mode="secondary"
            size="m"
            aria-controls={comparisonBodyId}
            aria-expanded={!isCollapsed}
            onClick={() => setIsCollapsed((currentValue) => !currentValue)}
          >
            {isCollapsed ? 'Показать сравнение' : 'Скрыть сравнение'}
          </Button>
          <Button
            mode="secondary"
            size="m"
            disabled={selectedMovies.length === 0}
            onClick={onClear}
          >
            Очистить сравнение
          </Button>
        </div>
      </div>

      <div
        id={comparisonBodyId}
        className="comparison-panel__body"
        role="region"
        aria-label="Область сравнения фильмов"
        hidden={isCollapsed}
      >
        {selectedMovies.length === 0 ? (
          <div className="catalog-state">
            <h3 className="catalog-state__title">Пока нечего сравнивать</h3>
            <Text>
              Нажмите «Сравнить» на карточке фильма, чтобы собрать сравнительную таблицу.
            </Text>
          </div>
        ) : (
          <>
            <div className="comparison-selection">
              {rows.map((movie, index) => (
                <div key={movie.id} className="comparison-selection__item">
                  <span className="comparison-selection__index">{index + 1}</span>
                  <div className="comparison-selection__copy">
                    <span className="comparison-selection__title">{movie.title}</span>
                    <Text>{formatYear(movie.year)}</Text>
                  </div>
                </div>
              ))}
            </div>

            {isPending ? (
              <div className="catalog-state">
                <Spinner size="s" />
                <Text>Загружаем дополнительные данные для сравнения...</Text>
              </div>
            ) : null}

            <div
              className="comparison-table"
              role="table"
              aria-label="Таблица сравнения фильмов"
            >
              <div className="comparison-table__row comparison-table__row--head" role="row">
                <div
                  className="comparison-table__cell comparison-table__cell--label"
                  role="columnheader"
                >
                  Поле
                </div>
                {rows.map((movie) => (
                  <div
                    key={movie.id}
                    className="comparison-table__cell comparison-table__cell--movie"
                    role="columnheader"
                  >
                    <div className="comparison-table__movie">
                      {movie.posterUrlPreview ?? movie.posterUrl ? (
                        <img
                          className="comparison-table__poster"
                          src={movie.posterUrlPreview ?? movie.posterUrl ?? undefined}
                          alt={`Постер для сравнения: ${movie.title}`}
                        />
                      ) : (
                        <div className="comparison-table__poster comparison-table__poster--fallback">
                          <span>Нет постера</span>
                        </div>
                      )}
                      <span>{movie.title}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="comparison-table__row" role="row">
                <div
                  className="comparison-table__cell comparison-table__cell--label"
                  role="rowheader"
                >
                  Название
                </div>
                {rows.map((movie) => (
                  <div key={movie.id} className="comparison-table__cell" role="cell">
                    {movie.title}
                  </div>
                ))}
              </div>

              <div className="comparison-table__row" role="row">
                <div
                  className="comparison-table__cell comparison-table__cell--label"
                  role="rowheader"
                >
                  Год выпуска
                </div>
                {rows.map((movie) => (
                  <div key={movie.id} className="comparison-table__cell" role="cell">
                    {formatYear(movie.year)}
                  </div>
                ))}
              </div>

              <div className="comparison-table__row" role="row">
                <div
                  className="comparison-table__cell comparison-table__cell--label"
                  role="rowheader"
                >
                  Рейтинг
                </div>
                {rows.map((movie) => (
                  <div key={movie.id} className="comparison-table__cell" role="cell">
                    {formatRating(movie.rating)}
                  </div>
                ))}
              </div>

              <div className="comparison-table__row" role="row">
                <div
                  className="comparison-table__cell comparison-table__cell--label"
                  role="rowheader"
                >
                  Жанры
                </div>
                {rows.map((movie) => (
                  <div key={movie.id} className="comparison-table__cell" role="cell">
                    {formatGenres(movie.genres)}
                  </div>
                ))}
              </div>

              <div className="comparison-table__row" role="row">
                <div
                  className="comparison-table__cell comparison-table__cell--label"
                  role="rowheader"
                >
                  Длительность
                </div>
                {rows.map((movie) => (
                  <div key={movie.id} className="comparison-table__cell" role="cell">
                    {formatDuration(movie.duration)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
