import { createContext } from 'react'

import type { MovieCard } from '@/entities/movie/model/types'

export type FavoritesContextValue = {
  favorites: MovieCard[]
  addFavorite: (movie: MovieCard) => void
  removeFavorite: (movieId: number) => void
  isFavorite: (movieId: number) => boolean
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)
