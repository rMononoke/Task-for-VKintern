import { createContext } from 'react'

import type { MovieCard } from '@/entities/movie/model/types'

export type ComparisonContextValue = {
  selectedMovies: MovieCard[]
  toggleMovie: (movie: MovieCard) => void
  isSelected: (movieId: number) => boolean
  clearComparison: () => void
}

export const ComparisonContext = createContext<ComparisonContextValue | null>(
  null,
)
