import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MovieDetailsPage } from '@/pages/movie-details/MovieDetailsPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const useMovieDetailsMock = vi.fn()
const useFavoritesMock = vi.fn()
const useComparisonMock = vi.fn()
const useParamsMock = vi.fn()

vi.mock('@/entities/movie/api/useMovieDetails', () => ({
  useMovieDetails: (...args: unknown[]) => useMovieDetailsMock(...args),
}))

vi.mock('@/features/favorites/model/useFavorites', () => ({
  useFavorites: () => useFavoritesMock(),
}))

vi.mock('@/features/comparison/model/useComparison', () => ({
  useComparison: () => useComparisonMock(),
}))

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')

  return {
    ...actual,
    useParams: () => useParamsMock(),
  }
})

const movie = {
  id: 1,
  title: 'Брат',
  year: 1997,
  rating: 8.4,
  posterUrl: 'poster',
  posterUrlPreview: 'preview',
  countries: ['Россия'],
  genres: ['драма', 'криминал', 'боевик'],
  description: 'Описание фильма',
  duration: 96,
  webUrl: 'https://example.com',
  releaseDate: '1997-05-17',
}

function setupBaseMocks() {
  useParamsMock.mockReturnValue({ movieId: '1' })
  useMovieDetailsMock.mockReturnValue({
    data: movie,
    isPending: false,
    isError: false,
    error: null,
  })
  useFavoritesMock.mockReturnValue({
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    isFavorite: vi.fn().mockReturnValue(false),
  })
  useComparisonMock.mockReturnValue({
    toggleMovie: vi.fn(),
    isSelected: vi.fn().mockReturnValue(false),
  })
}

describe('MovieDetailsPage', () => {
  it('renders the detailed movie information', () => {
    setupBaseMocks()

    renderWithProviders(<MovieDetailsPage />)

    expect(screen.getByRole('heading', { name: 'Брат' })).toBeInTheDocument()
    expect(screen.getByText('Описание фильма')).toBeInTheDocument()
    expect(screen.getByText('17.05.1997')).toBeInTheDocument()
  })

  it('shows an invalid-id state for incorrect params', () => {
    useParamsMock.mockReturnValue({ movieId: 'bad-id' })
    useMovieDetailsMock.mockReturnValue({
      data: null,
      isPending: false,
      isError: false,
      error: null,
    })
    useFavoritesMock.mockReturnValue({
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      isFavorite: vi.fn().mockReturnValue(false),
    })
    useComparisonMock.mockReturnValue({
      toggleMovie: vi.fn(),
      isSelected: vi.fn().mockReturnValue(false),
    })

    renderWithProviders(<MovieDetailsPage />)

    expect(screen.getByText('Некорректный идентификатор фильма')).toBeInTheDocument()
  })

  it('shows a loading state while details are pending', () => {
    useParamsMock.mockReturnValue({ movieId: '1' })
    useMovieDetailsMock.mockReturnValue({
      data: null,
      isPending: true,
      isError: false,
      error: null,
    })
    useFavoritesMock.mockReturnValue({
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      isFavorite: vi.fn().mockReturnValue(false),
    })
    useComparisonMock.mockReturnValue({
      toggleMovie: vi.fn(),
      isSelected: vi.fn().mockReturnValue(false),
    })

    renderWithProviders(<MovieDetailsPage />)

    expect(screen.getByText('Загружаем информацию о фильме')).toBeInTheDocument()
  })

  it('masks for confirmation before adding a movie to favorites', async () => {
    const user = userEvent.setup()

    setupBaseMocks()
    renderWithProviders(<MovieDetailsPage />)

    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('adds a movie to favorites only after confirmation', async () => {
    const user = userEvent.setup()
    const addFavorite = vi.fn()

    setupBaseMocks()
    useFavoritesMock.mockReturnValue({
      addFavorite,
      removeFavorite: vi.fn(),
      isFavorite: vi.fn().mockReturnValue(false),
    })

    renderWithProviders(<MovieDetailsPage />)

    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))
    await user.click(screen.getByRole('button', { name: 'Добавить' }))

    expect(addFavorite).toHaveBeenCalledWith(movie)
  })

  it('allows removing a movie from favorites', async () => {
    const user = userEvent.setup()
    const removeFavorite = vi.fn()

    setupBaseMocks()
    useFavoritesMock.mockReturnValue({
      addFavorite: vi.fn(),
      removeFavorite,
      isFavorite: vi.fn().mockReturnValue(true),
    })

    renderWithProviders(<MovieDetailsPage />)

    await user.click(screen.getByRole('button', { name: 'Удалить из избранного' }))

    expect(removeFavorite).toHaveBeenCalledWith(1)
  })

  it('allows adding and removing a movie from comparison on the details page', async () => {
    const user = userEvent.setup()
    const toggleMovie = vi.fn()

    setupBaseMocks()
    useComparisonMock.mockReturnValue({
      toggleMovie,
      isSelected: vi.fn().mockReturnValue(false),
    })

    const { rerender } = renderWithProviders(<MovieDetailsPage />)

    await user.click(screen.getByRole('button', { name: 'Добавить в сравнение' }))

    expect(toggleMovie).toHaveBeenCalledWith(movie)

    useComparisonMock.mockReturnValue({
      toggleMovie,
      isSelected: vi.fn().mockReturnValue(true),
    })

    rerender(<MovieDetailsPage />)

    expect(screen.getByRole('button', { name: 'Убрать из сравнения' })).toBeInTheDocument()
  })
})
