import { z } from 'zod'

import type {
  MovieCard,
  MovieDetails,
  MovieFilterOption,
  MovieFilters,
  MoviesPage,
} from '../model/types.ts'

const DEFAULT_RATING_RANGE = {
  from: 0,
  to: 10,
}

const CURRENT_YEAR = new Date().getFullYear()
const DEFAULT_YEAR_RANGE = {
  from: 1888,
  to: CURRENT_YEAR,
}

export const POISKKINO_API_PAGE_SIZE = 250

const LIST_SELECT_FIELDS = [
  'id',
  'name',
  'enName',
  'alternativeName',
  'year',
  'rating',
  'genres',
  'countries',
  'poster',
] as const

const namedValueSchema = z.object({
  name: z.string().nullable().optional(),
})

const posterSchema = z
  .object({
    url: z.string().nullable().optional(),
    previewUrl: z.string().nullable().optional(),
  })
  .nullish()

const ratingSchema = z
  .object({
    kp: z.number().nullable().optional(),
  })
  .nullish()

const premiereSchema = z
  .object({
    world: z.string().nullable().optional(),
    usa: z.string().nullable().optional(),
    russia: z.string().nullable().optional(),
    digital: z.string().nullable().optional(),
    dvd: z.string().nullable().optional(),
    bluRay: z.string().nullable().optional(),
    cinema: z.string().nullable().optional(),
  })
  .nullish()

const movieSchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional(),
  enName: z.string().nullable().optional(),
  alternativeName: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  year: z.number().nullable().optional(),
  rating: ratingSchema.optional(),
  poster: posterSchema.optional(),
  countries: z.array(namedValueSchema).default([]),
  genres: z.array(namedValueSchema).default([]),
  movieLength: z.number().nullable().optional(),
  seriesLength: z.number().nullable().optional(),
  totalSeriesLength: z.number().nullable().optional(),
  premiere: premiereSchema.optional(),
})

const moviesPageSchema = z.object({
  docs: z.array(movieSchema),
  next: z.string().nullable().optional(),
  hasNext: z.boolean().optional().default(false),
})

const possibleValueSchema = z.array(
  z.object({
    name: z.string().nullable().optional(),
    slug: z.string().nullable().optional(),
  }),
)

function trimValue(value: string | null | undefined) {
  const trimmedValue = value?.trim()

  return trimmedValue ? trimmedValue : null
}

function uniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter((value): value is string => value !== null)))
}

function pickMovieTitle(movie: {
  name?: string | null
  alternativeName?: string | null
  enName?: string | null
}) {
  return (
    trimValue(movie.name) ||
    trimValue(movie.alternativeName) ||
    trimValue(movie.enName) ||
    'Без названия'
  )
}

function pickStringValues(items: Array<{ name?: string | null }>) {
  return uniqueValues(items.map((item) => trimValue(item.name)))
}

function pickMovieDuration(movie: z.infer<typeof movieSchema>) {
  return movie.movieLength ?? movie.totalSeriesLength ?? movie.seriesLength ?? null
}

function pickReleaseDate(premiere: z.infer<typeof premiereSchema>) {
  if (!premiere) {
    return null
  }

  return (
    trimValue(premiere.world) ||
    trimValue(premiere.russia) ||
    trimValue(premiere.cinema) ||
    trimValue(premiere.digital) ||
    trimValue(premiere.dvd) ||
    trimValue(premiere.bluRay) ||
    trimValue(premiere.usa) ||
    null
  )
}

function mapMovieCard(movie: z.infer<typeof movieSchema>): MovieCard {
  return {
    id: movie.id,
    title: pickMovieTitle(movie),
    year: movie.year ?? null,
    rating: movie.rating?.kp ?? null,
    posterUrl: movie.poster?.url ?? null,
    posterUrlPreview: movie.poster?.previewUrl ?? null,
    countries: pickStringValues(movie.countries),
    genres: pickStringValues(movie.genres),
  }
}

function buildRangeFilter(
  from: number,
  to: number,
  defaultRange: {
    from: number
    to: number
  },
) {
  if (from === defaultRange.from && to === defaultRange.to) {
    return undefined
  }

  return `${from}-${to}`
}

function resolveSortField(order: MovieFilters['order']) {
  switch (order) {
    case 'RATING':
      return 'rating.kp'
    case 'YEAR':
      return 'year'
    case 'NUM_VOTE':
    default:
      return 'votes.kp'
  }
}

type PoiskKinoMovieParams = Record<
  string,
  boolean | number | string | string[] | undefined
>

export function buildPoiskKinoMovieParams(
  filters: MovieFilters,
  nextCursor?: string | null,
): PoiskKinoMovieParams {
  const params: PoiskKinoMovieParams = {
    limit: POISKKINO_API_PAGE_SIZE,
    withCount: false,
    selectFields: [...LIST_SELECT_FIELDS],
    sortField: [resolveSortField(filters.order)],
    sortType: ['-1'],
  }

  if (nextCursor) {
    params.next = nextCursor
  }

  const ratingRange = buildRangeFilter(
    filters.ratingFrom,
    filters.ratingTo,
    DEFAULT_RATING_RANGE,
  )

  if (ratingRange) {
    params['rating.kp'] = [ratingRange]
  }

  const yearRange = buildRangeFilter(
    filters.yearFrom,
    filters.yearTo,
    DEFAULT_YEAR_RANGE,
  )

  if (yearRange) {
    params.year = [yearRange]
  }

  return params
}

export function mapPoiskKinoMoviesPage(payload: unknown): MoviesPage {
  const result = moviesPageSchema.parse(payload)

  return {
    items: result.docs.map(mapMovieCard),
    nextCursor: result.next ?? null,
    hasNextPage: result.hasNext,
  }
}

export function mapPoiskKinoMovieDetails(payload: unknown): MovieDetails {
  const result = movieSchema.parse(payload)

  return {
    ...mapMovieCard(result),
    description:
      trimValue(result.description) ||
      trimValue(result.shortDescription) ||
      'Описание отсутствует.',
    duration: pickMovieDuration(result),
    webUrl: `https://www.kinopoisk.ru/film/${result.id}/`,
    releaseDate: pickReleaseDate(result.premiere),
  }
}

export function mapPoiskKinoGenreOptions(payload: unknown): MovieFilterOption[] {
  const result = possibleValueSchema.parse(payload)

  return uniqueValues(result.map((option) => trimValue(option.name)))
    .sort((first, second) => first.localeCompare(second, 'ru'))
    .map((genreName) => ({
      id: genreName,
      label: genreName,
    }))
}
