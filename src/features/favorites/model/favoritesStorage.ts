import type { MovieCard } from '@/entities/movie/model/types'

export const FAVORITES_STORAGE_KEY = 'film-search:favorites'

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isMovieCard(value: unknown): value is MovieCard {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const movie = value as Partial<MovieCard>

  return (
    typeof movie.id === 'number' &&
    typeof movie.title === 'string' &&
    (typeof movie.year === 'number' || movie.year === null) &&
    (typeof movie.rating === 'number' || movie.rating === null) &&
    (typeof movie.posterUrl === 'string' || movie.posterUrl === null) &&
    (typeof movie.posterUrlPreview === 'string' || movie.posterUrlPreview === null) &&
    isStringArray(movie.countries) &&
    isStringArray(movie.genres)
  )
}

export function readFavoriteMovies(storage: Storage = window.localStorage) {
  const rawValue = storage.getItem(FAVORITES_STORAGE_KEY)

  if (!rawValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue.filter(isMovieCard)
  } catch {
    return []
  }
}

export function writeFavoriteMovies(
  movies: MovieCard[],
  storage: Storage = window.localStorage,
) {
  storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(movies))
}

export function addFavoriteMovie(movies: MovieCard[], movie: MovieCard) {
  const hasMovie = movies.some((currentMovie) => currentMovie.id === movie.id)

  return hasMovie ? movies : [movie, ...movies]
}

export function removeFavoriteMovie(movies: MovieCard[], movieId: number) {
  return movies.filter((movie) => movie.id !== movieId)
}
