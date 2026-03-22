import type { MovieCard, MovieFilters, MoviesPage } from '@/entities/movie/model/types'

export type CatalogBatchCursor = {
  index: number
}

export type CatalogBatchPage = MoviesPage & {
  nextCursor?: CatalogBatchCursor
}

type FetchMoviesPage = (filters: MovieFilters) => Promise<MoviesPage>

type CatalogSegment = Omit<MovieFilters, 'page' | 'order'>

type CatalogBatchFetcherOptions = {
  batchSize?: number
  explorationOrders?: MovieFilters['order'][]
  maxApiPages?: number
  saturationTotal?: number
}

const DEFAULT_BATCH_SIZE = 50
const DEFAULT_MAX_API_PAGES = 5
const DEFAULT_SATURATION_TOTAL = 100
const DEFAULT_EXPLORATION_ORDERS: MovieFilters['order'][] = [
  'NUM_VOTE',
  'RATING',
  'YEAR',
]

export const INITIAL_CATALOG_BATCH_CURSOR: CatalogBatchCursor = {
  index: 0,
}

function createSegmentKey(segment: CatalogSegment, order: MovieFilters['order'], page: number) {
  return JSON.stringify({
    ...segment,
    order,
    page,
  })
}

function dedupeMovies(items: MovieCard[]) {
  const seenIds = new Set<number>()

  return items.filter((movie) => {
    if (seenIds.has(movie.id)) {
      return false
    }

    seenIds.add(movie.id)
    return true
  })
}

function isMovieMatchingFilters(movie: MovieCard, filters: CatalogSegment) {
  const matchesYear =
    movie.year !== null &&
    movie.year >= filters.yearFrom &&
    movie.year <= filters.yearTo

  const hasRatingConstraint = filters.ratingFrom > 0 || filters.ratingTo < 10
  const matchesRating =
    !hasRatingConstraint ||
    (movie.rating !== null &&
      movie.rating >= filters.ratingFrom &&
      movie.rating <= filters.ratingTo)

  return matchesYear && matchesRating
}

function splitSegment(segment: CatalogSegment): CatalogSegment[] {
  if (segment.yearFrom >= segment.yearTo) {
    return []
  }

  const midpoint = Math.floor((segment.yearFrom + segment.yearTo) / 2)

  return [
    {
      ...segment,
      yearFrom: midpoint + 1,
      yearTo: segment.yearTo,
    },
    {
      ...segment,
      yearFrom: segment.yearFrom,
      yearTo: midpoint,
    },
  ]
}

export function createCatalogBatchFetcher(
  fetchMoviesPage: FetchMoviesPage,
  baseFilters: MovieFilters,
  options: CatalogBatchFetcherOptions = {},
) {
  const batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE
  const maxApiPages = options.maxApiPages ?? DEFAULT_MAX_API_PAGES
  const saturationTotal = options.saturationTotal ?? DEFAULT_SATURATION_TOTAL
  const explorationOrders = Array.from(
    new Set([
      baseFilters.order,
      ...(options.explorationOrders ?? DEFAULT_EXPLORATION_ORDERS),
    ]),
  )

  const pageCache = new Map<string, Promise<MoviesPage>>()
  const seenMovieIds = new Set<number>()
  const bufferedItems: MovieCard[] = []
  const pendingSegments: CatalogSegment[] = [
    {
      genres: [...baseFilters.genres],
      ratingFrom: baseFilters.ratingFrom,
      ratingTo: baseFilters.ratingTo,
      yearFrom: baseFilters.yearFrom,
      yearTo: baseFilters.yearTo,
      type: baseFilters.type,
    },
  ]

  function getPage(segment: CatalogSegment, order: MovieFilters['order'], page: number) {
    const cacheKey = createSegmentKey(segment, order, page)
    const cachedPage = pageCache.get(cacheKey)

    if (cachedPage) {
      return cachedPage
    }

    const pagePromise = fetchMoviesPage({
      ...segment,
      order,
      page,
    })
    pageCache.set(cacheKey, pagePromise)

    return pagePromise
  }

  async function collectSegment(segment: CatalogSegment) {
    const collectedItems: MovieCard[] = []
    let isSaturated = false

    for (const order of explorationOrders) {
      for (let page = 1; page <= maxApiPages; page += 1) {
        const pageResult = await getPage(segment, order, page)

        collectedItems.push(...pageResult.items)

        if (page === 1) {
          isSaturated ||= 
            pageResult.total >= saturationTotal && pageResult.totalPages >= maxApiPages
        }

        if (page >= pageResult.totalPages || pageResult.items.length === 0) {
          break
        }
      }
    }

    return {
      isSaturated,
      items: dedupeMovies(collectedItems).filter((movie) =>
        isMovieMatchingFilters(movie, segment),
      ),
    }
  }

  async function fillBuffer() {
    while (bufferedItems.length < batchSize && pendingSegments.length > 0) {
      const nextSegment = pendingSegments.shift()

      if (!nextSegment) {
        break
      }

      const segmentResult = await collectSegment(nextSegment)

      for (const movie of segmentResult.items) {
        if (seenMovieIds.has(movie.id)) {
          continue
        }

        seenMovieIds.add(movie.id)
        bufferedItems.push(movie)
      }

      if (segmentResult.isSaturated) {
        pendingSegments.push(...splitSegment(nextSegment))
      }
    }
  }

  return async function fetchCatalogBatch(
    cursor: CatalogBatchCursor = INITIAL_CATALOG_BATCH_CURSOR,
  ): Promise<CatalogBatchPage> {
    await fillBuffer()

    const items = bufferedItems.splice(0, batchSize)
    const hasMore = bufferedItems.length > 0 || pendingSegments.length > 0

    return {
      items,
      total: seenMovieIds.size,
      totalPages: hasMore ? cursor.index + 2 : cursor.index + 1,
      nextCursor: hasMore
        ? {
            index: cursor.index + 1,
          }
        : undefined,
    }
  }
}
