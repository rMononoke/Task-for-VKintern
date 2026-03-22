import assert from 'node:assert/strict'
import test from 'node:test'

import {
  collectCatalogMovies,
  getNextVisibleMoviesCount,
  shouldPrefetchCatalogMovies,
} from './catalogMovies.ts'

import type {
  MovieCard,
  MoviesPage,
} from '../../../entities/movie/model/types.ts'

function createMovie(
  id: number,
  title: string,
  genres: string[],
): MovieCard {
  return {
    id,
    title,
    year: 2024,
    rating: 8,
    posterUrl: null,
    posterUrlPreview: null,
    countries: ['Japan'],
    genres,
  }
}

function createMoviesPage(items: MovieCard[]): MoviesPage {
  return {
    items,
    nextCursor: null,
    hasNextPage: false,
  }
}

test('collectCatalogMovies removes duplicates across API pages and keeps first occurrence order', () => {
  const movies = collectCatalogMovies([
    createMoviesPage([
      createMovie(1, 'First movie', ['драма']),
      createMovie(2, 'Second movie', ['триллер']),
    ]),
    createMoviesPage([
      createMovie(2, 'Second movie duplicate', ['триллер']),
      createMovie(3, 'Third movie', ['комедия']),
    ]),
  ])

  assert.deepEqual(
    movies.map((movie) => movie.id),
    [1, 2, 3],
  )
  assert.equal(movies[1]?.title, 'Second movie')
})

test('collectCatalogMovies keeps genre intersection locally for multiple selected genres', () => {
  const movies = collectCatalogMovies(
    [
      createMoviesPage([
        createMovie(1, 'Anime only', ['аниме']),
        createMovie(2, 'Fantasy only', ['фэнтези']),
        createMovie(3, 'Anime fantasy', ['аниме', 'фэнтези']),
      ]),
    ],
    ['аниме', 'фэнтези'],
  )

  assert.deepEqual(
    movies.map((movie) => movie.id),
    [3],
  )
})

test('shouldPrefetchCatalogMovies keeps loading while there are too few prepared movies', () => {
  assert.equal(
    shouldPrefetchCatalogMovies({
      loadedMoviesCount: 8,
      minimumMoviesCount: 24,
      hasNextPage: true,
      isPending: false,
      isFetchingNextPage: false,
    }),
    true,
  )

  assert.equal(
    shouldPrefetchCatalogMovies({
      loadedMoviesCount: 24,
      minimumMoviesCount: 24,
      hasNextPage: true,
      isPending: false,
      isFetchingNextPage: false,
    }),
    false,
  )
})

test('getNextVisibleMoviesCount grows in full chunks without exceeding loaded movies', () => {
  assert.equal(getNextVisibleMoviesCount(24, 60, 24), 48)
  assert.equal(getNextVisibleMoviesCount(48, 60, 24), 60)
})
