import { describe, expect, it } from 'vitest'

import {
  toggleComparisonMovie,
  trimComparisonQueue,
} from '@/features/comparison/model/comparisonSelection'

const movies = [
  {
    id: 1,
    title: 'One',
    year: 2001,
    rating: 7.1,
    posterUrl: null,
    posterUrlPreview: null,
    countries: [],
    genres: [],
  },
  {
    id: 2,
    title: 'Two',
    year: 2002,
    rating: 7.2,
    posterUrl: null,
    posterUrlPreview: null,
    countries: [],
    genres: [],
  },
  {
    id: 3,
    title: 'Three',
    year: 2003,
    rating: 7.3,
    posterUrl: null,
    posterUrlPreview: null,
    countries: [],
    genres: [],
  },
]

describe('comparisonSelection', () => {
  it('keeps only the last two movies in the queue', () => {
    expect(trimComparisonQueue(movies)).toEqual([movies[1], movies[2]])
  })

  it('adds a movie to the comparison queue', () => {
    expect(toggleComparisonMovie([], movies[0])).toEqual([movies[0]])
  })

  it('removes a movie that is already selected', () => {
    expect(toggleComparisonMovie([movies[0], movies[1]], movies[0])).toEqual([movies[1]])
  })

  it('drops the oldest selected movie when adding a third one', () => {
    expect(toggleComparisonMovie([movies[0], movies[1]], movies[2])).toEqual([
      movies[1],
      movies[2],
    ])
  })
})
