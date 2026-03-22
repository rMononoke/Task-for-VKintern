import type {
  MovieCard,
  MoviesPage,
} from '../../../entities/movie/model/types.ts'

export const CATALOG_GRID_COLUMNS = 4
export const CATALOG_MOVIES_STEP = CATALOG_GRID_COLUMNS * 6
export const CATALOG_MIN_READY_MOVIES = CATALOG_MOVIES_STEP

type ShouldPrefetchCatalogMoviesParams = {
  loadedMoviesCount: number
  minimumMoviesCount: number
  hasNextPage: boolean
  isPending: boolean
  isFetchingNextPage: boolean
}

function normalizeGenreValue(value: string) {
  return value.trim().toLocaleLowerCase()
}

function isMovieMatchingSelectedGenres(
  movie: MovieCard,
  selectedGenres: string[],
) {
  if (selectedGenres.length === 0) {
    return true
  }

  const movieGenres = new Set(movie.genres.map(normalizeGenreValue))

  return selectedGenres.every((selectedGenre) =>
    movieGenres.has(normalizeGenreValue(selectedGenre)),
  )
}

export function collectCatalogMovies(
  pages: MoviesPage[],
  selectedGenres: string[] = [],
) {
  const normalizedSelectedGenres = Array.from(
    new Set(
      selectedGenres
        .map((genre) => normalizeGenreValue(genre))
        .filter((genre) => genre !== ''),
    ),
  )
  const seenMovieIds = new Set<number>()
  const collectedMovies: MovieCard[] = []

  for (const page of pages) {
    for (const movie of page.items) {
      if (
        seenMovieIds.has(movie.id) ||
        !isMovieMatchingSelectedGenres(movie, normalizedSelectedGenres)
      ) {
        continue
      }

      seenMovieIds.add(movie.id)
      collectedMovies.push(movie)
    }
  }

  return collectedMovies
}

export function shouldPrefetchCatalogMovies({
  loadedMoviesCount,
  minimumMoviesCount,
  hasNextPage,
  isPending,
  isFetchingNextPage,
}: ShouldPrefetchCatalogMoviesParams) {
  if (isPending || isFetchingNextPage || !hasNextPage) {
    return false
  }

  return loadedMoviesCount < minimumMoviesCount
}

export function getNextVisibleMoviesCount(
  currentVisibleMoviesCount: number,
  loadedMoviesCount: number,
  step = CATALOG_MOVIES_STEP,
) {
  return Math.min(currentVisibleMoviesCount + step, loadedMoviesCount)
}
