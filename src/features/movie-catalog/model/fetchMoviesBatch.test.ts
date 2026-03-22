import { describe, expect, it, vi } from 'vitest'

import {
  createMoviesBatchFetcher,
  INITIAL_MOVIES_BATCH_CURSOR,
} from '@/features/movie-catalog/model/fetchMoviesBatch'

describe('fetchMoviesBatch', () => {
  it('combines items from multiple api pages into one batch', async () => {
    const fetchMoviesPage = vi.fn(async (apiPage: number) => {
      if (apiPage === 1) {
        return {
          items: [
            { id: 1, title: 'One', year: 2001, rating: 7.1, posterUrl: null, posterUrlPreview: null, countries: [], genres: [] },
            { id: 2, title: 'Two', year: 2002, rating: 7.2, posterUrl: null, posterUrlPreview: null, countries: [], genres: [] },
          ],
          total: 4,
          totalPages: 2,
        }
      }

      return {
        items: [
          { id: 3, title: 'Three', year: 2003, rating: 7.3, posterUrl: null, posterUrlPreview: null, countries: [], genres: [] },
          { id: 4, title: 'Four', year: 2004, rating: 7.4, posterUrl: null, posterUrlPreview: null, countries: [], genres: [] },
        ],
        total: 4,
        totalPages: 2,
      }
    })

    const fetchBatch = createMoviesBatchFetcher(fetchMoviesPage, 3)
    const result = await fetchBatch(INITIAL_MOVIES_BATCH_CURSOR)

    expect(result.items.map((movie) => movie.id)).toEqual([1, 2, 3])
    expect(result.nextCursor).toEqual({ apiPage: 2, offset: 1 })
  })

  it('reuses cached api pages between batch calls', async () => {
    const fetchMoviesPage = vi.fn(async (apiPage: number) => ({
      items: [
        { id: apiPage * 10 + 1, title: 'Movie', year: 2000, rating: 7, posterUrl: null, posterUrlPreview: null, countries: [], genres: [] },
        { id: apiPage * 10 + 2, title: 'Movie', year: 2000, rating: 7, posterUrl: null, posterUrlPreview: null, countries: [], genres: [] },
      ],
      total: 4,
      totalPages: 2,
    }))

    const fetchBatch = createMoviesBatchFetcher(fetchMoviesPage, 2)

    const firstBatch = await fetchBatch()
    await fetchBatch(firstBatch.nextCursor)

    expect(fetchMoviesPage).toHaveBeenCalledTimes(2)
  })
})
