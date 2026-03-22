import { z } from 'zod'

import type {
  MovieCard,
  MovieDetails,
  MovieFilterOption,
  MoviesPage,
} from '@/entities/movie/model/types'

const namedValueSchema = z.object({
  genre: z.string().optional(),
  country: z.string().optional(),
})

const movieCardSchema = z.object({
  kinopoiskId: z.number(),
  nameRu: z.string().nullable().optional(),
  nameEn: z.string().nullable().optional(),
  nameOriginal: z.string().nullable().optional(),
  year: z.number().nullable().optional(),
  ratingKinopoisk: z.number().nullable().optional(),
  posterUrl: z.string().nullable().optional(),
  posterUrlPreview: z.string().nullable().optional(),
  countries: z.array(namedValueSchema).default([]),
  genres: z.array(namedValueSchema).default([]),
})

const moviesPageSchema = z.object({
  items: z.array(movieCardSchema),
  total: z.number(),
  totalPages: z.number(),
})

const movieDetailsSchema = movieCardSchema.extend({
  description: z.string().nullable().optional(),
  filmLength: z.number().nullable().optional(),
  webUrl: z.string().nullable().optional(),
})

const movieFiltersSchema = z.object({
  genres: z.array(
    z.object({
      id: z.number(),
      genre: z.string(),
    }),
  ),
})

const distributionItemSchema = z.object({
  type: z.string(),
  date: z.string().nullable().optional(),
  reRelease: z.boolean().nullable().optional(),
})

const movieDistributionsSchema = z.object({
  items: z.array(distributionItemSchema).default([]),
})

function pickMovieTitle(movie: {
  nameRu?: string | null
  nameOriginal?: string | null
  nameEn?: string | null
}) {
  return movie.nameRu || movie.nameOriginal || movie.nameEn || 'Без названия'
}

function pickStringValues(
  items: Array<{ genre?: string; country?: string }>,
  key: 'genre' | 'country',
) {
  return items
    .map((item) => item[key]?.trim())
    .filter((value): value is string => Boolean(value))
}

function baseMovieMapper(movie: z.infer<typeof movieCardSchema>): MovieCard {
  return {
    id: movie.kinopoiskId,
    title: pickMovieTitle(movie),
    year: movie.year ?? null,
    rating: movie.ratingKinopoisk ?? null,
    posterUrl: movie.posterUrl ?? null,
    posterUrlPreview: movie.posterUrlPreview ?? null,
    countries: pickStringValues(movie.countries, 'country'),
    genres: pickStringValues(movie.genres, 'genre'),
  }
}

function pickReleaseDateByType(
  items: Array<z.infer<typeof distributionItemSchema>>,
  type: string,
) {
  const matchingDates = items
    .filter((item) => item.type === type && item.date)
    .map((item) => item.date as string)
    .sort()

  return matchingDates[0] ?? null
}

export function mapMoviesPage(payload: unknown): MoviesPage {
  const result = moviesPageSchema.parse(payload)

  return {
    total: result.total,
    totalPages: result.totalPages,
    items: result.items.map(baseMovieMapper),
  }
}

export function mapMovieDetails(payload: unknown): MovieDetails {
  const result = movieDetailsSchema.parse(payload)

  return {
    ...baseMovieMapper(result),
    description: result.description?.trim() || 'Описание отсутствует.',
    duration: result.filmLength ?? null,
    webUrl: result.webUrl ?? null,
    releaseDate: null,
  }
}

export function mapMovieReleaseDate(payload: unknown): string | null {
  const result = movieDistributionsSchema.parse(payload)

  return (
    pickReleaseDateByType(result.items, 'WORLD_PREMIER') ||
    pickReleaseDateByType(result.items, 'PREMIERE') ||
    pickReleaseDateByType(result.items, 'COUNTRY_SPECIFIC') ||
    result.items
      .map((item) => item.date)
      .filter((value): value is string => Boolean(value))
      .sort()[0] ||
    null
  )
}

export function mapGenreOptions(payload: unknown): MovieFilterOption[] {
  const result = movieFiltersSchema.parse(payload)

  return result.genres
    .map((genre) => ({
      id: genre.id,
      label: genre.genre.trim(),
    }))
    .filter((genre) => Boolean(genre.label))
}
