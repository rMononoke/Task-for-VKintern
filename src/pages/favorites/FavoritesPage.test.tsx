import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FavoritesPage } from '@/pages/favorites/FavoritesPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const useFavoritesMock = vi.fn()

vi.mock('@/features/favorites/model/useFavorites', () => ({
  useFavorites: () => useFavoritesMock(),
}))

describe('FavoritesPage', () => {
  it('shows an empty state when there are no favorite movies', () => {
    useFavoritesMock.mockReturnValue({
      favorites: [],
      removeFavorite: vi.fn(),
    })

    renderWithProviders(<FavoritesPage />)

    expect(screen.getByText('Избранное пока пусто')).toBeInTheDocument()
  })

  it('renders saved favorite movies in a dedicated fixed-size grid', () => {
    useFavoritesMock.mockReturnValue({
      favorites: [
        {
          id: 1,
          title: 'Брат',
          year: 1997,
          rating: 8.4,
          posterUrl: null,
          posterUrlPreview: null,
          countries: [],
          genres: ['драма'],
        },
      ],
      removeFavorite: vi.fn(),
    })

    renderWithProviders(<FavoritesPage />)

    expect(screen.getByTestId('favorites-grid')).toBeInTheDocument()
    expect(screen.getByText('Брат')).toBeInTheDocument()
  })

  it('allows removing a movie from favorites', async () => {
    const user = userEvent.setup()
    const removeFavorite = vi.fn()

    useFavoritesMock.mockReturnValue({
      favorites: [
        {
          id: 1,
          title: 'Брат',
          year: 1997,
          rating: 8.4,
          posterUrl: null,
          posterUrlPreview: null,
          countries: [],
          genres: ['драма'],
        },
      ],
      removeFavorite,
    })

    renderWithProviders(<FavoritesPage />)

    await user.click(screen.getByRole('button', { name: 'Удалить из избранного: Брат' }))

    expect(removeFavorite).toHaveBeenCalledWith(1)
  })
})
