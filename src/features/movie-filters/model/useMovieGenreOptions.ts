import { useQuery } from '@tanstack/react-query'

import { fetchGenreOptions } from '@/entities/movie/api/movieApi'
import { movieQueryKeys } from '@/entities/movie/api/queryKeys'

export function useMovieGenreOptions() {
  return useQuery({
    queryKey: movieQueryKeys.genres(),
    queryFn: () => fetchGenreOptions(),
  })
}
