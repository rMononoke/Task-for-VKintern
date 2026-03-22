import { describe, expect, it, vi } from 'vitest'

import {
  buildMoviesParams,
  fetchGenreOptions,
  fetchMovieDetails,
} from '@/entities/movie/api/movieApi'

describe('movieApi', () => {
  it('builds request params for the movies list', () => {
    expect(
      buildMoviesParams({
        genres: [1, 3],
        ratingFrom: 5,
        ratingTo: 8,
        yearFrom: 2000,
        yearTo: 2020,
        order: 'RATING',
        type: 'FILM',
        page: 2,
      }),
    ).toEqual({
      genres: '1,3',
      order: 'RATING',
      page: 2,
      ratingFrom: 5,
      ratingTo: 8,
      type: 'FILM',
      yearFrom: 2000,
      yearTo: 2020,
    })
  })

  it('fetches details and merges release date information', async () => {
    const client = {
      get: vi.fn((url: string) => {
        if (url === '/films/13') {
          return Promise.resolve({
            data: {
              kinopoiskId: 13,
              nameRu: '1+1',
              year: 2011,
              ratingKinopoisk: 8.9,
              filmLength: 112,
              description: 'Описание',
              webUrl: 'https://example.com',
              countries: [],
              genres: [],
            },
          })
        }

        return Promise.resolve({
          data: {
            items: [{ type: 'WORLD_PREMIER', date: '2011-09-23' }],
          },
        })
      }),
    }

    const result = await fetchMovieDetails(13, client as never)

    expect(result.title).toBe('1+1')
    expect(result.releaseDate).toBe('2011-09-23')
    expect(client.get).toHaveBeenCalledTimes(2)
  })

  it('fetches and maps genre options', async () => {
    const client = {
      get: vi.fn().mockResolvedValue({
        data: {
          genres: [{ id: 1, genre: 'комедия' }],
        },
      }),
    }

    await expect(fetchGenreOptions(client as never)).resolves.toEqual([
      { id: 1, label: 'комедия' },
    ])
  })
})
