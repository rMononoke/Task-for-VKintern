import { useQuery } from '@tanstack/react-query'

import { fetchMovieDetails } from '@/entities/movie/api/movieApi'
import { movieQueryKeys } from '@/entities/movie/api/queryKeys'

export function useMovieDetails(movieId: number | null) {
  return useQuery({
    queryKey: movieQueryKeys.details(movieId ?? 0),
    queryFn: () => fetchMovieDetails(movieId as number),
    enabled: movieId !== null,
  })
}
