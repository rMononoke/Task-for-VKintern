import { describe, expect, it } from 'vitest'

import {
  addFavoriteMovie,
  FAVORITES_STORAGE_KEY,
  readFavoriteMovies,
  removeFavoriteMovie,
  writeFavoriteMovies,
} from '@/features/favorites/model/favoritesStorage'

const movie = {
  id: 1,
  title: 'Брат',
  year: 1997,
  rating: 8.4,
  posterUrl: null,
  posterUrlPreview: null,
  countries: ['Россия'],
  genres: ['драма'],
}

describe('favoritesStorage', () => {
  it('returns an empty array for invalid storage data', () => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, '{"broken":true}')

    expect(readFavoriteMovies()).toEqual([])
  })

  it('writes and reads favorite movies', () => {
    writeFavoriteMovies([movie])

    expect(readFavoriteMovies()).toEqual([movie])
  })

  it('does not duplicate an existing favorite movie', () => {
    expect(addFavoriteMovie([movie], movie)).toEqual([movie])
  })

  it('removes a movie from favorites', () => {
    expect(removeFavoriteMovie([movie], 1)).toEqual([])
  })
})
