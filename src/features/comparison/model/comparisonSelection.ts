import type { MovieCard } from '@/entities/movie/model/types'

const MAX_COMPARISON_MOVIES = 2

export function trimComparisonQueue(movies: MovieCard[]) {
  return movies.slice(-MAX_COMPARISON_MOVIES)
}

export function toggleComparisonMovie(
  currentMovies: MovieCard[],
  movie: MovieCard,
) {
  const isAlreadySelected = currentMovies.some(
    (currentMovie) => currentMovie.id === movie.id,
  )

  if (isAlreadySelected) {
    return currentMovies.filter((currentMovie) => currentMovie.id !== movie.id)
  }

  return trimComparisonQueue([...currentMovies, movie])
}
