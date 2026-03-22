import { useEffect, useState, type PropsWithChildren } from 'react'

import type { MovieCard } from '@/entities/movie/model/types'
import { FavoritesContext } from '@/features/favorites/model/FavoritesContext'
import {
  addFavoriteMovie,
  readFavoriteMovies,
  removeFavoriteMovie,
  writeFavoriteMovies,
} from '@/features/favorites/model/favoritesStorage'

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favorites, setFavorites] = useState<MovieCard[]>(() => readFavoriteMovies())

  useEffect(() => {
    writeFavoriteMovies(favorites)
  }, [favorites])

  function addFavorite(movie: MovieCard) {
    setFavorites((currentFavorites) => addFavoriteMovie(currentFavorites, movie))
  }

  function removeFavorite(movieId: number) {
    setFavorites((currentFavorites) => removeFavoriteMovie(currentFavorites, movieId))
  }

  function isFavorite(movieId: number) {
    return favorites.some((movie) => movie.id === movieId)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
