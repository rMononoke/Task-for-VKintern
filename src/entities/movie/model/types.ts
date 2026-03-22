export type MovieCard = {
  id: number
  title: string
  year: number | null
  rating: number | null
  posterUrl: string | null
  posterUrlPreview: string | null
  countries: string[]
  genres: string[]
}

export type MovieDetails = MovieCard & {
  description: string
  duration: number | null
  webUrl: string | null
  releaseDate: string | null
}

export type MovieFilterOption = {
  id: string
  label: string
}

export type MovieFilters = {
  genres: string[]
  ratingFrom: number
  ratingTo: number
  yearFrom: number
  yearTo: number
  order: 'NUM_VOTE' | 'RATING' | 'YEAR'
  type: 'FILM'
  page: number
}

export type MoviesPage = {
  items: MovieCard[]
  nextCursor: string | null
  hasNextPage: boolean
}
