import { useQueries } from '@tanstack/react-query'

import { fetchMovieDetails } from '@/entities/movie/api/movieApi'
import { movieQueryKeys } from '@/entities/movie/api/queryKeys'
import type { MovieCard, MovieDetails } from '@/entities/movie/model/types'

export type ComparisonMovieDetails = Pick<
  MovieDetails,
  'id' | 'title' | 'year' | 'rating' | 'genres' | 'duration'
>

function mapComparisonMovieDetails(movie: MovieDetails): ComparisonMovieDetails {
  return {
    id: movie.id,
    title: movie.title,
    year: movie.year,
    rating: movie.rating,
    genres: movie.genres,
    duration: movie.duration,
  }
}

export function useComparisonMovieDetails(selectedMovies: MovieCard[]) {
  const queries = useQueries({
    queries: selectedMovies.map((movie) => ({
      queryKey: movieQueryKeys.details(movie.id),
      queryFn: () => fetchMovieDetails(movie.id),
    })),
  })

  return {
    comparisonMovies: queries.flatMap((query) =>
      query.data ? [mapComparisonMovieDetails(query.data)] : [],
    ),
    isPending: queries.some((query) => query.isPending),
  }
}
