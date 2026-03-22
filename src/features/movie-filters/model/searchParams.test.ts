import { describe, expect, it } from 'vitest'

import {
  createMovieCatalogSearchParams,
  DEFAULT_CATALOG_FILTER_VALUES,
  parseMovieCatalogSearchParams,
} from '@/features/movie-filters/model/searchParams'

describe('searchParams', () => {
  it('returns default filter values for empty params', () => {
    expect(parseMovieCatalogSearchParams(new URLSearchParams())).toEqual(
      DEFAULT_CATALOG_FILTER_VALUES,
    )
  })

  it('normalizes genre ids to unique sorted values', () => {
    const result = parseMovieCatalogSearchParams(new URLSearchParams('genres=3,1,3,2'))

    expect(result.genres).toEqual([1, 2, 3])
  })

  it('resets an invalid rating range to defaults', () => {
    const result = parseMovieCatalogSearchParams(
      new URLSearchParams('ratingFrom=9&ratingTo=4'),
    )

    expect(result.ratingFrom).toBe(DEFAULT_CATALOG_FILTER_VALUES.ratingFrom)
    expect(result.ratingTo).toBe(DEFAULT_CATALOG_FILTER_VALUES.ratingTo)
  })

  it('keeps years earlier than 1990 available after parsing', () => {
    const result = parseMovieCatalogSearchParams(
      new URLSearchParams('yearFrom=1888&yearTo=1895'),
    )

    expect(result.yearFrom).toBe(1888)
    expect(result.yearTo).toBe(1895)
  })

  it('creates params only for non-default values', () => {
    expect(
      createMovieCatalogSearchParams({
        ...DEFAULT_CATALOG_FILTER_VALUES,
        genres: [1, 2],
        ratingFrom: 4,
      }).toString(),
    ).toBe('genres=1%2C2&ratingFrom=4')
  })
})
