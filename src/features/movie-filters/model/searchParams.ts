const CURRENT_YEAR = new Date().getFullYear()
const MIN_YEAR = 1888
const MIN_RATING = 0
const MAX_RATING = 10

export type MovieCatalogFilterValues = {
  genres: string[]
  ratingFrom: number
  ratingTo: number
  yearFrom: number
  yearTo: number
}

export const DEFAULT_CATALOG_FILTER_VALUES: MovieCatalogFilterValues = {
  genres: [],
  ratingFrom: MIN_RATING,
  ratingTo: MAX_RATING,
  yearFrom: MIN_YEAR,
  yearTo: CURRENT_YEAR,
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function normalizeGenres(value: string | null) {
  if (!value) {
    return DEFAULT_CATALOG_FILTER_VALUES.genres
  }

  return Array.from(
    new Set(
      value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== ''),
    ),
  ).sort((first, second) => first.localeCompare(second, 'ru'))
}

function parseNumber(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
) {
  if (value === null) {
    return fallback
  }

  const parsedValue = Number(value)

  if (Number.isNaN(parsedValue)) {
    return fallback
  }

  return clamp(parsedValue, min, max)
}

function normalizeRange(from: number, to: number, min: number, max: number) {
  const normalizedFrom = clamp(from, min, max)
  const normalizedTo = clamp(to, min, max)

  if (normalizedFrom > normalizedTo) {
    return {
      from: min,
      to: max,
    }
  }

  return {
    from: normalizedFrom,
    to: normalizedTo,
  }
}

export function parseMovieCatalogSearchParams(
  searchParams: URLSearchParams,
): MovieCatalogFilterValues {
  const ratingRange = normalizeRange(
    parseNumber(
      searchParams.get('ratingFrom'),
      DEFAULT_CATALOG_FILTER_VALUES.ratingFrom,
      MIN_RATING,
      MAX_RATING,
    ),
    parseNumber(
      searchParams.get('ratingTo'),
      DEFAULT_CATALOG_FILTER_VALUES.ratingTo,
      MIN_RATING,
      MAX_RATING,
    ),
    MIN_RATING,
    MAX_RATING,
  )

  const yearRange = normalizeRange(
    parseNumber(
      searchParams.get('yearFrom'),
      DEFAULT_CATALOG_FILTER_VALUES.yearFrom,
      MIN_YEAR,
      CURRENT_YEAR,
    ),
    parseNumber(
      searchParams.get('yearTo'),
      DEFAULT_CATALOG_FILTER_VALUES.yearTo,
      MIN_YEAR,
      CURRENT_YEAR,
    ),
    MIN_YEAR,
    CURRENT_YEAR,
  )

  return {
    genres: normalizeGenres(searchParams.get('genres')),
    ratingFrom: ratingRange.from,
    ratingTo: ratingRange.to,
    yearFrom: yearRange.from,
    yearTo: yearRange.to,
  }
}

export function createMovieCatalogSearchParams(
  filters: MovieCatalogFilterValues,
) {
  const searchParams = new URLSearchParams()

  if (filters.genres.length > 0) {
    searchParams.set('genres', filters.genres.join(','))
  }

  if (filters.ratingFrom !== DEFAULT_CATALOG_FILTER_VALUES.ratingFrom) {
    searchParams.set('ratingFrom', String(filters.ratingFrom))
  }

  if (filters.ratingTo !== DEFAULT_CATALOG_FILTER_VALUES.ratingTo) {
    searchParams.set('ratingTo', String(filters.ratingTo))
  }

  if (filters.yearFrom !== DEFAULT_CATALOG_FILTER_VALUES.yearFrom) {
    searchParams.set('yearFrom', String(filters.yearFrom))
  }

  if (filters.yearTo !== DEFAULT_CATALOG_FILTER_VALUES.yearTo) {
    searchParams.set('yearTo', String(filters.yearTo))
  }

  return searchParams
}
