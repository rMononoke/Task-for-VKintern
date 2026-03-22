import type { MoviesPage } from '@/entities/movie/model/types'

export const KINOPOISK_MOVIES_API_PAGE_SIZE = 20
export const MOVIES_BATCH_SIZE = 50

export type MoviesBatchCursor = {
  apiPage: number
  offset: number
}

export type MoviesBatchPage = MoviesPage & {
  nextCursor?: MoviesBatchCursor
}

type FetchMoviesPage = (apiPage: number) => Promise<MoviesPage>

export const INITIAL_MOVIES_BATCH_CURSOR: MoviesBatchCursor = {
  apiPage: 1,
  offset: 0,
}

function resolveNextCursor(
  currentPage: MoviesPage | null,
  apiPage: number,
  offset: number,
): MoviesBatchCursor | undefined {
  if (!currentPage) {
    return undefined
  }

  if (offset < currentPage.items.length) {
    return {
      apiPage,
      offset,
    }
  }

  if (apiPage < currentPage.totalPages) {
    return {
      apiPage: apiPage + 1,
      offset: 0,
    }
  }

  return undefined
}

export function createMoviesBatchFetcher(
  fetchMoviesPage: FetchMoviesPage,
  batchSize = MOVIES_BATCH_SIZE,
) {
  const pageCache = new Map<number, Promise<MoviesPage>>()

  function getPage(apiPage: number) {
    const existingPage = pageCache.get(apiPage)

    if (existingPage) {
      return existingPage
    }

    const pagePromise = fetchMoviesPage(apiPage)
    pageCache.set(apiPage, pagePromise)

    return pagePromise
  }

  return async function fetchMoviesBatch(
    cursor: MoviesBatchCursor = INITIAL_MOVIES_BATCH_CURSOR,
  ): Promise<MoviesBatchPage> {
    const items: MoviesPage['items'] = []
    let apiPage = cursor.apiPage
    let offset = cursor.offset
    let currentPage: MoviesPage | null = null

    while (items.length < batchSize) {
      currentPage = await getPage(apiPage)

      const pageItems = currentPage.items.slice(offset)

      if (pageItems.length === 0) {
        if (apiPage >= currentPage.totalPages) {
          break
        }

        apiPage += 1
        offset = 0
        continue
      }

      const missingItems = batchSize - items.length
      const nextChunk = pageItems.slice(0, missingItems)

      items.push(...nextChunk)
      offset += nextChunk.length

      if (items.length >= batchSize) {
        break
      }

      if (offset >= currentPage.items.length) {
        if (apiPage >= currentPage.totalPages) {
          break
        }

        apiPage += 1
        offset = 0
      }
    }

    return {
      items,
      total: currentPage?.total ?? 0,
      totalPages: currentPage?.totalPages ?? 0,
      nextCursor: resolveNextCursor(currentPage, apiPage, offset),
    }
  }
}
