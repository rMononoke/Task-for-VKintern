import { useState, type PropsWithChildren } from 'react'

import type { MovieCard } from '@/entities/movie/model/types'
import { ComparisonContext } from '@/features/comparison/model/ComparisonContext'
import { toggleComparisonMovie } from '@/features/comparison/model/comparisonSelection'

export function ComparisonProvider({ children }: PropsWithChildren) {
  const [selectedMovies, setSelectedMovies] = useState<MovieCard[]>([])

  function toggleMovie(movie: MovieCard) {
    setSelectedMovies((currentMovies) =>
      toggleComparisonMovie(currentMovies, movie),
    )
  }

  function isSelected(movieId: number) {
    return selectedMovies.some((movie) => movie.id === movieId)
  }

  function clearComparison() {
    setSelectedMovies([])
  }

  return (
    <ComparisonContext.Provider
      value={{ selectedMovies, toggleMovie, isSelected, clearComparison }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}
