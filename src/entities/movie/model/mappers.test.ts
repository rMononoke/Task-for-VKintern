import { describe, expect, it } from 'vitest'

import {
  mapGenreOptions,
  mapMovieDetails,
  mapMovieReleaseDate,
  mapMoviesPage,
} from '@/entities/movie/model/mappers'

describe('mappers', () => {
  it('maps a movies page to movie cards', () => {
    const result = mapMoviesPage({
      items: [
        {
          kinopoiskId: 1,
          nameRu: 'Брат',
          year: 1997,
          ratingKinopoisk: 8.4,
          posterUrl: 'poster',
          posterUrlPreview: 'preview',
          countries: [{ country: 'Россия' }],
          genres: [{ genre: 'драма' }, { genre: ' боевик ' }],
        },
      ],
      total: 1,
      totalPages: 1,
    })

    expect(result).toEqual({
      items: [
        {
          id: 1,
          title: 'Брат',
          year: 1997,
          rating: 8.4,
          posterUrl: 'poster',
          posterUrlPreview: 'preview',
          countries: ['Россия'],
          genres: ['драма', 'боевик'],
        },
      ],
      total: 1,
      totalPages: 1,
    })
  })

  it('maps movie details and fills missing description', () => {
    const result = mapMovieDetails({
      kinopoiskId: 2,
      nameOriginal: 'The Gentlemen',
      year: 2019,
      ratingKinopoisk: 8.7,
      filmLength: 113,
      webUrl: 'https://example.com',
      countries: [],
      genres: [],
    })

    expect(result.description).toBe('Описание отсутствует.')
    expect(result.title).toBe('The Gentlemen')
    expect(result.duration).toBe(113)
  })

  it('prefers world premier release dates', () => {
    expect(
      mapMovieReleaseDate({
        items: [
          { type: 'PREMIERE', date: '2020-10-10' },
          { type: 'WORLD_PREMIER', date: '2020-09-01' },
        ],
      }),
    ).toBe('2020-09-01')
  })

  it('maps genre options and filters empty labels', () => {
    expect(
      mapGenreOptions({
        genres: [
          { id: 1, genre: 'драма' },
          { id: 2, genre: '   ' },
        ],
      }),
    ).toEqual([{ id: 1, label: 'драма' }])
  })
})
