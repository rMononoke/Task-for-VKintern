import type { MovieFilters } from '@/entities/movie/model/types'

export const DEFAULT_MOVIE_FILTERS: MovieFilters = {
  genres: [],
  ratingFrom: 0,
  ratingTo: 10,
  yearFrom: 1888,
  yearTo: new Date().getFullYear(),
  order: 'NUM_VOTE',
  type: 'FILM',
  page: 1,
}
