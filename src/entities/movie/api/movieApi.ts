import type { AxiosInstance } from 'axios'

import {
  buildPoiskKinoMovieParams,
  mapPoiskKinoGenreOptions,
  mapPoiskKinoMovieDetails,
  mapPoiskKinoMoviesPage,
} from '@/entities/movie/api/poiskkinoAdapter'
import { DEFAULT_MOVIE_FILTERS } from '@/entities/movie/model/constants'
import type {
  MovieDetails,
  MovieFilterOption,
  MovieFilters,
  MoviesPage,
} from '@/entities/movie/model/types'
import { apiClient } from '@/shared/api/client'

export async function fetchMovies(
  client: AxiosInstance = apiClient,
  filters: MovieFilters = DEFAULT_MOVIE_FILTERS,
  nextCursor: string | null = null,
): Promise<MoviesPage> {
  const response = await client.get('/v1.5/movie', {
    params: buildPoiskKinoMovieParams(filters, nextCursor),
  })

  return mapPoiskKinoMoviesPage(response.data)
}

export async function fetchMovieDetails(
  movieId: number,
  client: AxiosInstance = apiClient,
): Promise<MovieDetails> {
  const response = await client.get(`/v1.4/movie/${movieId}`)

  return mapPoiskKinoMovieDetails(response.data)
}

export async function fetchGenreOptions(
  client: AxiosInstance = apiClient,
): Promise<MovieFilterOption[]> {
  const response = await client.get('/v1/movie/possible-values-by-field', {
    params: {
      field: 'genres.name',
    },
  })

  return mapPoiskKinoGenreOptions(response.data)
}
