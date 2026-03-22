import type { AxiosInstance } from 'axios'

import { DEFAULT_MOVIE_FILTERS } from '@/entities/movie/model/constants'
import {
  mapGenreOptions,
  mapMovieDetails,
  mapMovieReleaseDate,
  mapMoviesPage,
} from '@/entities/movie/model/mappers'
import type {
  MovieDetails,
  MovieFilterOption,
  MovieFilters,
  MoviesPage,
} from '@/entities/movie/model/types'
import { apiClient } from '@/shared/api/client'

export function buildMoviesParams(filters: MovieFilters = DEFAULT_MOVIE_FILTERS) {
  return {
    order: filters.order,
    type: filters.type,
    ratingFrom: filters.ratingFrom,
    ratingTo: filters.ratingTo,
    yearFrom: filters.yearFrom,
    yearTo: filters.yearTo,
    page: filters.page,
    ...(filters.genres.length > 0 && { genres: filters.genres.join(',') }),
  }
}

export async function fetchMovies(
  client: AxiosInstance = apiClient,
  filters: MovieFilters = DEFAULT_MOVIE_FILTERS,
): Promise<MoviesPage> {
  const response = await client.get('/films', {
    params: buildMoviesParams(filters),
  })

  return mapMoviesPage(response.data)
}

async function fetchMovieReleaseDate(
  movieId: number,
  client: AxiosInstance = apiClient,
) {
  try {
    const response = await client.get(`/films/${movieId}/distributions`)

    return mapMovieReleaseDate(response.data)
  } catch {
    return null
  }
}

export async function fetchMovieDetails(
  movieId: number,
  client: AxiosInstance = apiClient,
): Promise<MovieDetails> {
  const [movieDetailsResponse, releaseDate] = await Promise.all([
    client.get(`/films/${movieId}`),
    fetchMovieReleaseDate(movieId, client),
  ])

  return {
    ...mapMovieDetails(movieDetailsResponse.data),
    releaseDate,
  }
}

export async function fetchGenreOptions(
  client: AxiosInstance = apiClient,
): Promise<MovieFilterOption[]> {
  const response = await client.get('/films/filters')

  return mapGenreOptions(response.data)
}
