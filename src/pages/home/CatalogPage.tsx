import { Button, Spinner, Text, Title } from '@vkontakte/vkui'

import { MoviePreviewCard } from '@/entities/movie/ui/MoviePreviewCard'
import { useComparison } from '@/features/comparison/model/useComparison'
import { useComparisonMovieDetails } from '@/features/comparison/model/useComparisonMovieDetails'
import { MovieComparisonPanel } from '@/features/comparison/ui/MovieComparisonPanel'
import { useMovieCatalog } from '@/features/movie-catalog/model/useMovieCatalog'
import { useMovieCatalogFilters } from '@/features/movie-filters/model/useMovieCatalogFilters'
import { DEFAULT_CATALOG_FILTER_VALUES } from '@/features/movie-filters/model/searchParams'
import { useMovieGenreOptions } from '@/features/movie-filters/model/useMovieGenreOptions'
import { MovieFiltersPanel } from '@/features/movie-filters/ui/MovieFiltersPanel'
import { useInfiniteScrollTrigger } from '@/shared/lib/useInfiniteScrollTrigger'

function MovieCardsSkeleton() {
  return (
    <div className="movie-grid" aria-hidden="true">
      {Array.from({ length: 10 }, (_, index) => (
        <div key={index} className="movie-card movie-card--skeleton">
          <div className="movie-card__poster movie-card__poster--skeleton" />
          <div className="movie-card__content">
            <div className="movie-card__line movie-card__line--short" />
            <div className="movie-card__line" />
            <div className="movie-card__line movie-card__line--tiny" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CatalogPage() {
  const {
    filterValues,
    queryFilters,
    toggleGenre,
    setRatingFrom,
    setRatingTo,
    setYearFrom,
    setYearTo,
    resetFilters,
  } = useMovieCatalogFilters()
  const {
    data: genreOptions = [],
    isPending: isGenreOptionsPending,
  } = useMovieGenreOptions()
  const {
    movies,
    isPending,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useMovieCatalog(queryFilters)
  const {
    selectedMovies,
    toggleMovie,
    isSelected,
    clearComparison,
  } = useComparison()
  const {
    comparisonMovies,
    isPending: isComparisonPending,
  } = useComparisonMovieDetails(selectedMovies)

  const activeFiltersCount = [
    filterValues.genres.length > 0,
    filterValues.ratingFrom !== DEFAULT_CATALOG_FILTER_VALUES.ratingFrom,
    filterValues.ratingTo !== DEFAULT_CATALOG_FILTER_VALUES.ratingTo,
    filterValues.yearFrom !== DEFAULT_CATALOG_FILTER_VALUES.yearFrom,
    filterValues.yearTo !== DEFAULT_CATALOG_FILTER_VALUES.yearTo,
  ].filter(Boolean).length

  const sentinelRef = useInfiniteScrollTrigger({
    canLoadMore: Boolean(hasNextPage),
    isLoading: isPending || isFetchingNextPage,
    onLoadMore: () => {
      void fetchNextPage()
    },
  })

  return (
    <div className="page-stack">
      <section className="surface-section">
        <div className="surface-section__header">
          <div className="surface-section__copy">
            <p className="surface-section__eyebrow">Каталог</p>
            <h2 className="surface-section__title">
              <Title level="2" weight="2">
                Каталог фильмов
              </Title>
            </h2>
            <Text>
              Здесь вы можете найти информацию о всех интересующих вас фильмах
            </Text>
          </div>

          <div className="catalog-summary">
            <span className="catalog-summary__item">Загружено: {movies.length}</span>
            <span className="catalog-summary__item">Шаг подгрузки: 50</span>
          </div>
        </div>

        <MovieFiltersPanel
          activeFiltersCount={activeFiltersCount}
          genreOptions={genreOptions}
          isGenreOptionsLoading={isGenreOptionsPending}
          values={filterValues}
          onToggleGenre={toggleGenre}
          onRatingFromChange={setRatingFrom}
          onRatingToChange={setRatingTo}
          onYearFromChange={setYearFrom}
          onYearToChange={setYearTo}
          onReset={resetFilters}
        />
      </section>

      <MovieComparisonPanel
        selectedMovies={selectedMovies}
        comparisonMovies={comparisonMovies}
        isPending={isComparisonPending}
        onClear={clearComparison}
      />

      <section className="surface-section">
        {isPending ? <MovieCardsSkeleton /> : null}

        {isError ? (
          <div className="catalog-state">
            <h3 className="catalog-state__title">
              <Title level="3" weight="2">
                Не удалось загрузить список фильмов
              </Title>
            </h3>
            <Text>
              {error instanceof Error
                ? error.message
                : 'Попробуйте повторить запрос чуть позже.'}
            </Text>
            <Button
              mode="primary"
              size="m"
              onClick={() => {
                void refetch()
              }}
            >
              Повторить
            </Button>
          </div>
        ) : null}

        {!isPending && !isError ? (
          <>
            {movies.length > 0 ? (
              <div className="movie-grid">
                {movies.map((movie) => {
                  const selected = isSelected(movie.id)

                  return (
                    <MoviePreviewCard
                      key={movie.id}
                      movie={movie}
                      actionSlot={
                        <Button
                          mode="tertiary"
                          size="s"
                          className={`movie-card__compare-button${
                            selected ? ' movie-card__compare-button--selected' : ''
                          }`}
                          aria-label={`${
                            selected ? 'Убрать из сравнения' : 'Добавить в сравнение'
                          }: ${movie.title}`}
                          onClick={() => toggleMovie(movie)}
                        >
                          {selected ? 'Убрать' : 'Сравнить'}
                        </Button>
                      }
                    />
                  )
                })}
              </div>
            ) : (
              <div className="catalog-state">
                <h3 className="catalog-state__title">
                  <Title level="3" weight="2">
                    Фильмы не найдены
                  </Title>
                </h3>
                <Text>Попробуйте обновить данные или изменить параметры поиска.</Text>
              </div>
            )}

            {movies.length > 0 ? (
              <>
                <div ref={sentinelRef} className="catalog-sentinel" aria-hidden="true" />

            <div className="catalog-footer">
              {isFetchingNextPage ? (
                <>
                  <Spinner size="s" />
                  <Text>Загружаем следующую подборку фильмов...</Text>
                </>
              ) : hasNextPage ? (
                <Text>Прокрутите ниже, чтобы загрузить еще 50 фильмов.</Text>
              ) : (
                <Text>Все доступные фильмы уже загружены.</Text>
              )}
                </div>
              </>
            ) : null}
          </>
        ) : null}
      </section>
    </div>
  )
}
