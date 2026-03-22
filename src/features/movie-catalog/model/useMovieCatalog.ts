import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { movieQueryKeys } from '@/entities/movie/api/queryKeys'
import { fetchMovies } from '@/entities/movie/api/movieApi'
import { DEFAULT_MOVIE_FILTERS } from '@/entities/movie/model/constants'
import type { MovieFilters } from '@/entities/movie/model/types'
import {
  createCatalogBatchFetcher,
  INITIAL_CATALOG_BATCH_CURSOR,
} from '@/features/movie-catalog/model/fetchCatalogBatches'

export function serializeMovieFilters(filters: MovieFilters) {
  return JSON.stringify(filters)
}

function deserializeMovieFilters(serializedFilters: string): MovieFilters {
  return JSON.parse(serializedFilters) as MovieFilters
}

export function useMovieCatalog(filters: MovieFilters = DEFAULT_MOVIE_FILTERS) {
  const serializedFilters = serializeMovieFilters(filters)
  const stableFilters = useMemo(
    () => deserializeMovieFilters(serializedFilters),
    [serializedFilters],
  )
  const batchFetcher = useMemo(
    () =>
      createCatalogBatchFetcher(
        (requestFilters) => fetchMovies(undefined, requestFilters),
        stableFilters,
      ),
    [stableFilters],
  )

  const query = useInfiniteQuery({
    queryKey: movieQueryKeys.list(serializedFilters),
    initialPageParam: INITIAL_CATALOG_BATCH_CURSOR,
    queryFn: ({ pageParam }) => batchFetcher(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  return {
    ...query,
    movies: query.data?.pages.flatMap((page) => page.items) ?? [],
  }
}
