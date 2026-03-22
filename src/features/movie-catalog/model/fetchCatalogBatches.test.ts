import { describe, expect, it, vi } from 'vitest'

import type { MovieFilters } from '@/entities/movie/model/types'
import {
  createCatalogBatchFetcher,
  INITIAL_CATALOG_BATCH_CURSOR,
} from '@/features/movie-catalog/model/fetchCatalogBatches'

const baseFilters: MovieFilters = {
  genres: [],
  ratingFrom: 0,
  ratingTo: 10,
  yearFrom: 1990,
  yearTo: 2020,
  order: 'NUM_VOTE' as const,
  type: 'FILM' as const,
  page: 1,
}

describe('fetchCatalogBatches', () => {
  it('keeps exploring saturated segments and returns more items across batches', async () => {
    const fetchMoviesPage = vi.fn(async (filters: MovieFilters) => {
      if (filters.yearFrom === 1990 && filters.yearTo === 2020) {
        return {
          items: [
            { id: 1, title: 'Root', year: 2010, rating: 8, posterUrl: null, posterUrlPreview: null, countries: [], genres: [] },
          ],
          total: 100,
          totalPages: 5,
        }
      }

      if (filters.yearFrom >= 2006) {
        return {
          items: [
            { id: 2, title: 'Recent', year: 2018, rating: 8, posterUrl: null, posterUrlPreview: null, countries: [], genres: [] },
          ],
          total: 1,
          totalPages: 1,
        }
      }

      return {
        items: [
          { id: 3, title: 'Old', year: 1997, rating: 8, posterUrl: null, posterUrlPreview: null, countries: [], genres: [] },
        ],
        total: 1,
        totalPages: 1,
      }
    })

    const fetchBatch = createCatalogBatchFetcher(fetchMoviesPage, baseFilters, {
      batchSize: 2,
      maxApiPages: 1,
      saturationTotal: 100,
    })

    const firstBatch = await fetchBatch(INITIAL_CATALOG_BATCH_CURSOR)
    const secondBatch = await fetchBatch(firstBatch.nextCursor)

    expect(firstBatch.items.map((movie) => movie.id)).toEqual([1, 2])
    expect(secondBatch.items.map((movie) => movie.id)).toEqual([3])
  })

  it('filters out movies that do not match the requested range', async () => {
    const fetchMoviesPage = vi.fn(async () => ({
      items: [
        { id: 1, title: 'Match', year: 2001, rating: 7, posterUrl: null, posterUrlPreview: null, countries: [], genres: [] },
        { id: 2, title: 'Wrong year', year: 1980, rating: 7, posterUrl: null, posterUrlPreview: null, countries: [], genres: [] },
        { id: 3, title: 'Wrong rating', year: 2001, rating: 9, posterUrl: null, posterUrlPreview: null, countries: [], genres: [] },
      ],
      total: 3,
      totalPages: 1,
    }))

    const fetchBatch = createCatalogBatchFetcher(
      fetchMoviesPage,
      {
        ...baseFilters,
        ratingFrom: 6,
        ratingTo: 8,
        yearFrom: 2000,
        yearTo: 2005,
      },
      { batchSize: 10, maxApiPages: 1, saturationTotal: 999 },
    )

    const result = await fetchBatch()

    expect(result.items.map((movie) => movie.id)).toEqual([1])
  })
})
