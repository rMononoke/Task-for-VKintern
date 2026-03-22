import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { fetchMovies } from '@/entities/movie/api/movieApi'
import { movieQueryKeys } from '@/entities/movie/api/queryKeys'
import { DEFAULT_MOVIE_FILTERS } from '@/entities/movie/model/constants'
import type { MovieFilters } from '@/entities/movie/model/types'
import {
  CATALOG_MIN_READY_MOVIES,
  CATALOG_MOVIES_STEP,
  collectCatalogMovies,
  getNextVisibleMoviesCount,
  shouldPrefetchCatalogMovies,
} from '@/features/movie-catalog/model/catalogMovies'

export function serializeMovieCatalogQuery(filters: MovieFilters) {
  return JSON.stringify({
    ...filters,
    genres: [...filters.genres].sort((first, second) =>
      first.localeCompare(second, 'ru'),
    ),
  } satisfies MovieFilters)
}

function deserializeMovieCatalogQuery(serializedQueryState: string) {
  return JSON.parse(serializedQueryState) as MovieFilters
}

export function useMovieCatalog(filters: MovieFilters = DEFAULT_MOVIE_FILTERS) {
  const serializedQueryState = serializeMovieCatalogQuery(filters)
  const stableQueryState = useMemo(
    () => deserializeMovieCatalogQuery(serializedQueryState),
    [serializedQueryState],
  )
  const [catalogViewportState, setCatalogViewportState] = useState(() => ({
    queryState: serializedQueryState,
    visibleMoviesCount: CATALOG_MOVIES_STEP,
  }))
  const visibleMoviesCount =
    catalogViewportState.queryState === serializedQueryState
      ? catalogViewportState.visibleMoviesCount
      : CATALOG_MOVIES_STEP

  const query = useInfiniteQuery({
    queryKey: movieQueryKeys.list(serializedQueryState),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      fetchMovies(undefined, stableQueryState, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  const allMovies = useMemo(
    () =>
      collectCatalogMovies(query.data?.pages ?? [], stableQueryState.genres),
    [query.data?.pages, stableQueryState.genres],
  )
  const movies = useMemo(
    () => allMovies.slice(0, visibleMoviesCount),
    [allMovies, visibleMoviesCount],
  )
  const {
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
  } = query
  const canRevealMore = visibleMoviesCount < allMovies.length
  const canLoadMore = canRevealMore || Boolean(hasNextPage)

  useEffect(() => {
    if (
      isError ||
      !shouldPrefetchCatalogMovies({
        loadedMoviesCount: allMovies.length,
        minimumMoviesCount: Math.max(
          CATALOG_MIN_READY_MOVIES,
          visibleMoviesCount,
        ),
        hasNextPage: Boolean(hasNextPage),
        isPending,
        isFetchingNextPage,
      })
    ) {
      return
    }

    void fetchNextPage()
  }, [
    allMovies.length,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
    visibleMoviesCount,
  ])

  async function loadMore() {
    if (canRevealMore) {
      setCatalogViewportState((currentCatalogViewportState) => {
        const currentVisibleMoviesCount =
          currentCatalogViewportState.queryState === serializedQueryState
            ? currentCatalogViewportState.visibleMoviesCount
            : CATALOG_MOVIES_STEP

        return {
          queryState: serializedQueryState,
          visibleMoviesCount: getNextVisibleMoviesCount(
            currentVisibleMoviesCount,
            allMovies.length,
          ),
        }
      })
      return
    }

    if (!hasNextPage || isFetchingNextPage) {
      return
    }

    await fetchNextPage()
  }

  return {
    ...query,
    movies,
    loadedMoviesCount: allMovies.length,
    hasNextPage: canLoadMore,
    fetchNextPage: loadMore,
  }
}
