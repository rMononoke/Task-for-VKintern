import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CatalogPage } from '@/pages/home/CatalogPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const useMovieCatalogMock = vi.fn()
const useMovieCatalogFiltersMock = vi.fn()
const useMovieGenreOptionsMock = vi.fn()
const useComparisonMock = vi.fn()
const useComparisonMovieDetailsMock = vi.fn()
const useInfiniteScrollTriggerMock = vi.fn()

vi.mock('@/features/movie-catalog/model/useMovieCatalog', () => ({
  useMovieCatalog: (...args: unknown[]) => useMovieCatalogMock(...args),
}))

vi.mock('@/features/movie-filters/model/useMovieCatalogFilters', () => ({
  useMovieCatalogFilters: () => useMovieCatalogFiltersMock(),
}))

vi.mock('@/features/movie-filters/model/useMovieGenreOptions', () => ({
  useMovieGenreOptions: () => useMovieGenreOptionsMock(),
}))

vi.mock('@/features/comparison/model/useComparison', () => ({
  useComparison: () => useComparisonMock(),
}))

vi.mock('@/features/comparison/model/useComparisonMovieDetails', () => ({
  useComparisonMovieDetails: (...args: unknown[]) => useComparisonMovieDetailsMock(...args),
}))

vi.mock('@/shared/lib/useInfiniteScrollTrigger', () => ({
  useInfiniteScrollTrigger: (...args: unknown[]) => useInfiniteScrollTriggerMock(...args),
}))

function createMovie(id: number) {
  return {
    id,
    title: `Movie ${id}`,
    year: 2000 + id,
    rating: 7.5,
    posterUrl: null,
    posterUrlPreview: `poster-${id}`,
    countries: [],
    genres: ['драма', 'комедия'],
  }
}

function setupCatalogMocks() {
  useMovieCatalogFiltersMock.mockReturnValue({
    filterValues: {
      genres: [],
      ratingFrom: 0,
      ratingTo: 10,
      yearFrom: 1888,
      yearTo: new Date().getFullYear(),
    },
    queryFilters: {
      genres: [],
      ratingFrom: 0,
      ratingTo: 10,
      yearFrom: 1888,
      yearTo: new Date().getFullYear(),
      order: 'NUM_VOTE',
      type: 'FILM',
      page: 1,
    },
    toggleGenre: vi.fn(),
    setRatingFrom: vi.fn(),
    setRatingTo: vi.fn(),
    setYearFrom: vi.fn(),
    setYearTo: vi.fn(),
    resetFilters: vi.fn(),
  })

  useMovieGenreOptionsMock.mockReturnValue({
    data: [],
    isPending: false,
  })

  useMovieCatalogMock.mockReturnValue({
    movies: Array.from({ length: 50 }, (_, index) => createMovie(index + 1)),
    isPending: false,
    isError: false,
    error: null,
    hasNextPage: true,
    isFetchingNextPage: false,
    fetchNextPage: vi.fn(),
    refetch: vi.fn(),
  })

  useComparisonMock.mockReturnValue({
    selectedMovies: [createMovie(101), createMovie(102)],
    toggleMovie: vi.fn(),
    isSelected: vi.fn().mockReturnValue(false),
    clearComparison: vi.fn(),
  })

  useComparisonMovieDetailsMock.mockReturnValue({
    comparisonMovies: [],
    isPending: false,
  })

  useInfiniteScrollTriggerMock.mockReturnValue({ current: null })
}

describe('CatalogPage', () => {
  it('renders 50 movie cards and the infinite-scroll hint', () => {
    setupCatalogMocks()

    renderWithProviders(<CatalogPage />)

    expect(screen.getAllByRole('button', { name: /Добавить в сравнение:/ })).toHaveLength(50)
    expect(
      screen.getByText('Прокрутите ниже, чтобы загрузить еще 50 фильмов.'),
    ).toBeInTheDocument()
  })

  it('renders poster thumbnails inside comparison and keeps compare button on the movie card', () => {
    setupCatalogMocks()

    renderWithProviders(<CatalogPage />)

    expect(screen.getByAltText('Постер для сравнения: Movie 101')).toBeInTheDocument()
    expect(screen.getByAltText('Постер для сравнения: Movie 102')).toBeInTheDocument()
    expect(
      screen
        .getAllByRole('button', { name: /Добавить в сравнение:/ })[0]
        .closest('.movie-card'),
    ).not.toBeNull()
  })

  it('does not render the "all loaded" footer when the catalog is empty', () => {
    setupCatalogMocks()
    useMovieCatalogMock.mockReturnValue({
      movies: [],
      isPending: false,
      isError: false,
      error: null,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      refetch: vi.fn(),
    })

    renderWithProviders(<CatalogPage />)

    expect(
      screen.getByText('Фильмы не найдены'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Все доступные фильмы уже загружены.'),
    ).not.toBeInTheDocument()
  })
})
