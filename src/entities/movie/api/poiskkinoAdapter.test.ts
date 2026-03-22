import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildPoiskKinoMovieParams,
  mapPoiskKinoGenreOptions,
  mapPoiskKinoMovieDetails,
  mapPoiskKinoMoviesPage,
} from './poiskkinoAdapter.ts'

import type { MovieFilters } from '../model/types.ts'

function createFilters(overrides: Partial<MovieFilters> = {}): MovieFilters {
  return {
    genres: [],
    ratingFrom: 0,
    ratingTo: 10,
    yearFrom: 1990,
    yearTo: 2026,
    order: 'NUM_VOTE',
    type: 'FILM',
    page: 1,
    ...overrides,
  }
}

test('buildPoiskKinoMovieParams encodes multi-genre intersection and cursor pagination', () => {
  const params = buildPoiskKinoMovieParams(
    createFilters({
      genres: ['аниме', 'фэнтези'],
      ratingFrom: 7.5,
      ratingTo: 9.1,
      yearFrom: 2001,
      yearTo: 2007,
      order: 'RATING',
    }),
    'cursor-2',
  )

  assert.deepEqual(params, {
    limit: 250,
    withCount: false,
    next: 'cursor-2',
    selectFields: [
      'id',
      'name',
      'enName',
      'alternativeName',
      'year',
      'rating',
      'genres',
      'countries',
      'poster',
    ],
    sortField: ['rating.kp'],
    sortType: ['-1'],
    year: ['2001-2007'],
    'rating.kp': ['7.5-9.1'],
  })
})

test('mapPoiskKinoMoviesPage keeps movie cards and cursor metadata', () => {
  const page = mapPoiskKinoMoviesPage({
    docs: [
      {
        id: 129,
        name: null,
        alternativeName: 'Унесенные призраками',
        enName: 'Spirited Away',
        year: 2001,
        rating: {
          kp: 8.5,
        },
        poster: {
          url: 'https://example.com/poster.jpg',
          previewUrl: 'https://example.com/poster-preview.jpg',
        },
        countries: [{ name: 'Япония' }],
        genres: [{ name: 'аниме' }, { name: 'фэнтези' }],
      },
    ],
    limit: 50,
    next: 'cursor-3',
    hasNext: true,
    hasPrev: false,
  })

  assert.deepEqual(page, {
    items: [
      {
        id: 129,
        title: 'Унесенные призраками',
        year: 2001,
        rating: 8.5,
        posterUrl: 'https://example.com/poster.jpg',
        posterUrlPreview: 'https://example.com/poster-preview.jpg',
        countries: ['Япония'],
        genres: ['аниме', 'фэнтези'],
      },
    ],
    nextCursor: 'cursor-3',
    hasNextPage: true,
  })
})

test('mapPoiskKinoMovieDetails uses fallback fields and keeps release date', () => {
  const details = mapPoiskKinoMovieDetails({
    id: 152,
    name: 'Мой сосед Тоторо',
    enName: 'My Neighbor Totoro',
    alternativeName: null,
    description: null,
    shortDescription: 'Сестры встречают лесного духа.',
    year: 1988,
    rating: {
      kp: 8.2,
    },
    movieLength: null,
    totalSeriesLength: 86,
    seriesLength: null,
    poster: {
      url: 'https://example.com/totoro.jpg',
      previewUrl: 'https://example.com/totoro-preview.jpg',
    },
    countries: [{ name: 'Япония' }],
    genres: [{ name: 'аниме' }, { name: 'семейный' }],
    premiere: {
      digital: '1988-04-16',
      world: '1988-04-10',
    },
  })

  assert.deepEqual(details, {
    id: 152,
    title: 'Мой сосед Тоторо',
    description: 'Сестры встречают лесного духа.',
    year: 1988,
    rating: 8.2,
    duration: 86,
    posterUrl: 'https://example.com/totoro.jpg',
    posterUrlPreview: 'https://example.com/totoro-preview.jpg',
    countries: ['Япония'],
    genres: ['аниме', 'семейный'],
    releaseDate: '1988-04-10',
    webUrl: 'https://www.kinopoisk.ru/film/152/',
  })
})

test('mapPoiskKinoGenreOptions trims, filters empty values and keeps string ids', () => {
  const options = mapPoiskKinoGenreOptions([
    { name: ' фэнтези ', slug: 'fantasy' },
    { name: 'аниме', slug: 'anime' },
    { name: null, slug: 'empty' },
    { name: 'аниме', slug: 'anime-duplicate' },
  ])

  assert.deepEqual(options, [
    {
      id: 'аниме',
      label: 'аниме',
    },
    {
      id: 'фэнтези',
      label: 'фэнтези',
    },
  ])
})
